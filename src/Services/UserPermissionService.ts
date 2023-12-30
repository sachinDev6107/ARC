import { sp } from '@pnp/sp/presets/all';

export default class UserPermissionService
{
    private _siteURL:string;
    constructor(_siteURL:string)
    {
        this._siteURL = _siteURL;
        this._setupPNP();
    }

    private _setupPNP():void{
        sp.setup({
            sp:{
                headers:{
                    Accept:'application/json;odata=verbose'
                },
                baseUrl:this._siteURL
            }
        });
    }

    public async GetAllSiteGroups(): Promise<any>
    {
        try {
            return sp.web.siteGroups.get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async GetCurrentUserGroups(): Promise<any>
    {
        try {
            return sp.web.currentUser.groups.get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async GetRoleAssignments(): Promise<any>
    {
        try {
            return sp.web.roleAssignments.get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async GetSiteGroupUsersByGroupName(groupName:string):Promise<any>
    {
        try {
            return await sp.web.siteGroups.getByName(groupName).users.get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async GetUserById(userId:number):Promise<any>
    {
        try {
            return await sp.web.getUserById(userId).get() as any;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async GetUserByEmail(userEmail:string):Promise<any>
    {
        try {
            return await sp.web.siteUsers.getByEmail(userEmail).get() as any;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async GetMyProperties():Promise<any>
    {
        try {
            return await sp.profiles.myProperties.get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async CheckUserInGroup(groupName:string,userId:number):Promise<any>
    {
        try {
            return await sp.web.siteGroups.getByName(groupName).users.getById(userId).get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async GetCurrentUserInfo():Promise<any>
    {
        try {
            return await sp.web.currentUser.get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async AddUserToGroup(groupName:string,loginName:string):Promise<any>
    {
        try {
            await sp.web.siteGroups.getByName(groupName).users.add(loginName);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async RemoveUserFromGroupById(groupName:string,userId:number):Promise<any>
    {
        try {
            await sp.web.siteGroups.getByName(groupName).users.removeById(userId);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async RemoveUserFromGroupByName(groupName:string,loginName:string):Promise<any>
    {
        try {
            await sp.web.siteGroups.getByName(groupName).users.removeByLoginName(loginName);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}