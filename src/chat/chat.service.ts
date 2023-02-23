import { Injectable,BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { Posts } from 'src/entities/post.entity';
import { Reply } from 'src/entities/reply.entity';
import { Take } from 'src/entities/take.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
    @InjectRepository(Take) private takeRepository: Repository<Take>,
    ){}

  async createChat(userId: number, postId : number, createChatDto: CreateChatDto) {
    // 익명 && 관리자 -> 에러 
    
    const post = await this.postRepository.findOne({id:postId},{relations:['space']});  
    if(!post) throw new BadRequestException("Invalid post");
    const verify = await this.isAdmin(userId, post.space.id);
    if(verify && createChatDto.isAnonymous) throw new BadRequestException("Admin can't create chat in anonymous");

    return this.chatRepository.save({
        ...createChatDto,
        userId, 
        post,
        child:[]
    });
  }

  async findAllChat(requestUserId : number, postId : number) {
    const post = await this.postRepository.findOne({id:postId},{relations:['space']});
    if(!post) throw new BadRequestException("Invalid post");
    const verify = await this.isAdmin(requestUserId,post.space.id);
    
    const chat = await this.chatRepository.find({where:{post},relations:['post','reply']});

    // post를 root로 하는 dfs 스패닝 트리 , JSON 
    // {chat-1 : [reply1 : [], .... ],}
    const result = []; 
    
    //1. 해당 post에 등록된 모든 chat 을 result에 집어 넣음
    
    for(let i=0;i<chat.length;i++){
      const {id,createdAt, updatedAt, content, isAnonymous,userId} = chat[i];
      const user = await this.userRepository.findOne({where:{id:userId}});

      let temp;
      let child = [];
      for(let j=0;j<chat[i].child.length;j++){
        const reply = await this.replyRepository.findOne({where:{id: parseInt(chat[i].child[j])}});
        const c = await this.dfs(reply,verify,requestUserId);
        
        child.push(c);
      }
      if(verify || (isAnonymous && userId===requestUserId)) temp = {id,createdAt,updatedAt,content,isAnonymous,user,child};
      else temp = {id,createdAt,updatedAt,content,isAnonymous,user:null,child};
      
      result.push(temp);
    }
    console.log(result);
    return result;
  }

  


  async removeChat(userId : number, postId : number, chatId : number) {
    const post = await this.postRepository.findOne({id:postId},{relations:['space']});
    if(!post) throw new BadRequestException("Invalid post");
    const verify = await this.isAdmin(userId,post.space.id);
    const chat = await this.chatRepository.findOne({id : chatId});
    
    if(!chat) throw new BadRequestException("Invalid chat id");

    await this.replyRepository.softDelete({chat});
    if(chat.userId === userId || verify){
      return this.chatRepository.softDelete({id:chatId});
    }else{
      throw new BadRequestException("You cant remove this chat");
    }

    
  }

  

  async createReplyToChat(userId : number, chatId : number , dto : CreateChatDto){
    //1. validation : 
    const chat = await this.chatRepository.findOne({id: chatId},{relations:['post']});
    if(!chat)  throw new BadRequestException("Invalid chat id");
    const post = await this.postRepository.findOne({id:chat.post.id},{relations:['space']});
    if(!post) throw new BadRequestException("Invalid post id");
    const verify = await this.isAdmin(userId, post.space.id);
    
    if(dto.isAnonymous && verify) throw new BadRequestException("Admin can't create reply in anonymous");

    // 2. create reply to chat
    // parent: 0 means that its parent is chat
    const reply = await this.replyRepository.save({
      ...dto,
      userId,
      parent : 0, 
      child : [],
      chat
    });

    chat.child.push(reply.id.toString());
    await this.chatRepository.save(chat);
    return reply;
  }

  async createReplyToReply(userId : number, chatId : number , parentReplyId : number, dto : CreateChatDto){
    //1. validation : 
    const chat = await this.chatRepository.findOne({id: chatId},{relations:['post']});
    if(!chat)  throw new BadRequestException("Invalid chat id");
    const post = await this.postRepository.findOne({id:chat.post.id},{relations:['space']});
    if(!post) throw new BadRequestException("Invalid post id");
    const verify = await this.isAdmin(userId, post.space.id);
    
    if(dto.isAnonymous && verify) throw new BadRequestException("Admin can't create reply in anonymous");
  
    // 2. create  current reply 
    const reply = await this.replyRepository.save({
      ...dto,
      userId,
      parent : parentReplyId,
      child : [],
      chat,
    })
    
    // 3. add current reply to parent
    const parentReply = await this.replyRepository.findOne({id:parentReplyId});
    parentReply.child.push(reply.id.toString());
    await this.replyRepository.save(parentReply);

    return reply;
  }

  async removeReply(requestUserId : number,chatId : number, replyId : number){
    //1. requestuser가 현재 권한이 있는지 확인 : admin 또는 작성자 
    const chat = await this.chatRepository.findOne({id:chatId},{relations:['post']});
    if(!chat) throw new BadRequestException("Invalid chat id");
    const postId = chat.post.id;
    const post = await this.postRepository.findOne({id:postId},{relations:['space']});
    if(!post) throw new BadRequestException("Invalid chat id");
    const verify = this.isAdmin(requestUserId,post.space.id);

    const reply = await this.replyRepository.findOne({id:replyId});
    if(!reply) throw new BadRequestException("Invalid reply id");
    if(!verify && reply.userId !== requestUserId) throw new ForbiddenException("You cant delete this reply");

    // 2. 해당 reply id의 부모에서 삭제 
    if(reply.parent===0){
      // chat에서 삭제 
      const index = chat.child.indexOf(reply.id.toString());
      chat.child.splice(index,1);
      await this.chatRepository.save(chat);
    }else{
      const parentReply = await this.replyRepository.findOne({where:{id:reply.parent}});
      const index = parentReply.child.indexOf(reply.id.toString());
      parentReply.child.splice(index,1);
      await this.replyRepository.save(parentReply);
    }
    // 3. dfs를 돌면서 삭제
    await this.dfs_to_erase_reply(reply);
    
    return reply;
  }

  async dfs_to_erase_reply(cur : any){

    for(let i =0;i<cur.child.length;i++){
      const nxt = parseInt(cur.child[i]);
      const nxtReply = await this.replyRepository.findOne({id:nxt});
      this.dfs_to_erase_reply(nxtReply);
    }
    await this.replyRepository.softDelete(cur.id);
  }
  
  async dfs(cur:any,verify:boolean,requestUserId:number){
    
    let result = [];
    const {id,createdAt, updatedAt, content, isAnonymous,userId} = cur;
    const user = await this.userRepository.findOne({where:{id:userId}});
    let temp;
    let child = [];
    for(let i=0;i<cur.child.length;i++){
      const nxt = parseInt(cur.child[i]);
      const nxtReply = await this.replyRepository.findOne({where:{id:nxt}});
      child.push(await this.dfs(nxtReply, verify,requestUserId));
    }
    
    if(verify || (isAnonymous && userId===requestUserId)) temp = {id,createdAt,updatedAt,content,isAnonymous,user,child};
    else temp = {id,createdAt,updatedAt,content,isAnonymous,user:null,child};
    result.push(temp);
    return result;

  }
  

  async isAdmin(userId : number, spaceId : number){
    const take = await this.takeRepository.findOne( {userId, spaceId},{relations:['role']});
    if(!take) throw new BadRequestException("You are not participating in this class");
    return take.role.isAdmin; 
  }
}
