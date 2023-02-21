export class CreatePostDto {
    title: string;
    description : string;
    files : string[];
    isNotification: boolean;
    isAdmin : boolean;
    isAnonymous: boolean;

}
