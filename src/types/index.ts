export type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

 export type Params = { 
    params: Promise<{id:string}> 

} 

 export type PostDetail = {
  id:string;
  title:string;
  content:string;
  createdAt:string;
  author:{id:string;name:string};
};

