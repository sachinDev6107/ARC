import { IItemAddResult, sp} from "@pnp/sp/presets/all";

export interface IListOperationService{
    AddItemToList:(listName:string,Item:any)=>Promise<any>;
    GetAllItemsFromList:(listName:string,filter:string,select:string[],expand:string[])=>Promise<any>;
    GetListField:(listName:string,fieldName:string)=>Promise<any>
}

export class ListOperationService implements IListOperationService{
  
  public async AddItemToList(listName: string, Item: any):Promise<any> {
        let result :IItemAddResult = await sp.web.lists.getByTitle(listName).items.add(Item);
        console.log(result); 
        return result;
    }
  public async GetAllItemsFromList(listName: string, filter: string, select: string[], expand: string[]):Promise<any>{
    let items = await sp.web.lists.getByTitle(listName).items;
    if(filter != ""){
        items = items.filter(filter);
    }
    if(expand.length>0){
        items=items.expand(...expand);
    }
    if(select.length>0){
        items=items.select(...select);
    }
    return items.getAll();
  }
   public async GetListField(listName: string, fieldName: string):Promise<any>{
    return await sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle(fieldName).get();
    // return item;
   }

    
}