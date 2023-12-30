import { IDropdownOption } from '@fluentui/react';
import { IEmailProperties, sp, Web } from '@pnp/sp/presets/all';


export default class SPListService {
    private _siteURL: string = "";
    public _top: number = 5000;
    public ROW_LIMIT: number = 2000;
    public _webURL: string;
    public web: any;

    constructor(siteURL?: string) {
        this.AccessWeb = this.AccessWeb.bind(this);
        this._siteURL = siteURL?siteURL:"";
        this._setupPNP();
        this.AccessWeb(this._siteURL)
    }

    public AccessWeb(url: string) {
        if (url) {
            this._webURL = url;
            this.web = new (Web as any)(url);
        }
    }

    private _setupPNP(): void {
        sp.setup({
            sp: {
                headers: {
                    Accept: 'application/json;odata=verbose'
                },
                baseUrl: this._siteURL
            }
        });
    }

    /**
     * Create list item
     * @param listName
     * @param metadata
     */
    public async CreateListItem(listName: string, metadata: any): Promise<any> {
        try {
            return await sp.web.lists.getByTitle(listName).items.add(metadata);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async CreateListItems(listName: string, items: any[]): Promise<any> {
        if (!listName || !items || !items.length) {
            return false;
        }
        try {
            const size = 300;
            const len = Math.ceil(items.length / size);
            const remainder = items.length % size;
            let list = sp.web.lists.getByTitle(listName);
            const entityTypeFullName = await list.getListItemEntityTypeFullName();
            const results: any = [];
            for (let i = 0; i < len; i++) {
                const batchSize = len - 1 === i && remainder > 0 ? remainder : size;
                let batch = sp.web.createBatch();
                for (let j = 0; j < batchSize; j++) {
                    const index = i * size + j;
                    list.items.inBatch(batch).add(items[index], entityTypeFullName).then(response => {
                        results.push(response.data);
                    })
                }
                await batch.execute();
            }
            return results;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }



    /**
     * update list by Item ID
     * @param itemId : List item ID
     * @param metadata : meta data of list item {ColumnName1:value, ColumnName2:value}
     */
    public async UpdateListItemByID(itemId: number, metadata: any, listName: string): Promise<any> {
        try {
            return await sp.web.lists.getByTitle(listName).items.getById(itemId).update(metadata);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async GetListItemByID(listName: string, itemId: number): Promise<any> {
        try {
            return await sp.web.lists.getByTitle(listName).items.filter("ID eq " + itemId).get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async CheckFolderExists(path: string): Promise<any> {
        return await sp.web.getFolderByServerRelativePath(path).select('Exists').get();
    }

    /**
     * Fetch list items - not all items
     */
    public async GetListItems(listName: string, queryColumns: string, filterQuery: string, expand: string = "", orderBy: string = "ID"): Promise<any> {
        try {
            if (expand === "") {
                return await sp.web.lists.getByTitle(listName).items.select(queryColumns).top(this._top).filter(filterQuery).orderBy(orderBy).get();
            }
            else if (filterQuery == "") {
                return await sp.web.lists.getByTitle(listName).items.top(this._top).select(queryColumns).expand(expand).orderBy(orderBy).get();
            }
            else {
                return await sp.web.lists.getByTitle(listName).items.top(this._top).filter(filterQuery).select(queryColumns).expand(expand).orderBy(orderBy).get();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Create the dropdown option from the list data
     * @param listName 
     * @param displayColumnName
     * @param orderByAsc
     */
    public async GetMasterDataOption(listName: string, displayColumnName: string, orderByAsc: boolean) {
        return new Promise((resolve, reject) => {
            try {
                sp.web.lists.getByTitle(listName).items.select("").orderBy(displayColumnName, orderByAsc).top(this._top).get()
                    .then((response) => {
                        let dpOptions: IDropdownOption[] = [];
                        if (response !== null) {
                            response.map((item) => {
                                dpOptions.push({ key: item.Id, text: item[displayColumnName] });
                            })
                        }
                        resolve(dpOptions);
                    }).catch((error: any) => {
                        reject(false);
                    })
            } catch (error) {
                console.log(error);
                reject(false);
            }
        })
    }

    public async UpdateListItemInBatch(items: Array<any>, listName: string): Promise<any> {

    }

    /**
     * Get list all items
     * @param columns : List of columns seprated by comma
     */
    public async GetAllListItems(listName: string, columns?: string): Promise<any> {
        try {
            if (columns) {
                return await sp.web.lists.getByTitle(listName).items.select(columns).getAll();
            }
            else {
                return await sp.web.lists.getByTitle(listName).items.getAll();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Delete list item by ID
     */
    public async DeleteListItemByID(listName: string, itemId: number): Promise<any> {
        try {
            return await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Delete file by server relative path
     * @param filePath
     */
    public async DeleteFileByFilePath(filePath: string, file: string): Promise<any> {
        try {
            return sp.web.getFolderByServerRelativeUrl(filePath).files.getByName(file).delete();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Get file content by url
     */
    public async GetFileContentByUrl(url: string): Promise<any> {
        try {
            return await sp.web.getFileByServerRelativePath(url).getBlob();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Get file by url
     */
    public async GetFileByUrl(url: string): Promise<any> {
        try {
            return sp.web.getFileByServerRelativeUrl(url);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Get library files from folder
     * @param folderName folder
     */
    public async GetLibraryFiles(listName: string, folderName: string): Promise<any> {
        try {
            await sp.web.getFolderByServerRelativeUrl(this._siteURL + '/' + listName + '/' + folderName).files.expand('ListItemAllFields')
                .get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Upload files to library folder
     * @param folderName
     * @param files files collection
     */
    public async UploadFilesToLibraryFolder(documents: any, folder: string): Promise<any> {
        try {
            // const folder = "Design Documents/ProjectName/2. From OEM or Contractor/4. PSS/Civil";
            for (const doc of documents) {
                await sp.web.getFolderByServerRelativeUrl(folder).files()
                    .then(async (d) => {
                        sp.web.getFolderByServerRelativeUrl(folder).folders.add('FileHistory');
                        d.forEach(async element => {
                            if (element.Name != 'CRS.xlsx') {
                                await sp.web.getFolderByServerRelativeUrl(folder + '/FileHistory').files.get().then(async files => {
                                    const totalFiles = +files.length;
                                    sp.web.getFolderByServerRelativeUrl(folder).files.getByName(element.Name).moveTo(folder + '/FileHistory/R' + totalFiles + '_' + element.Name)
                                    sp.web.getFolderByServerRelativeUrl(folder + '/FileHistory').folders.add(totalFiles + '_SupportingDocument');
                                    sp.web.getFolderByServerRelativeUrl(folder + '/SupportingDocument').files.get().then(async files => {
                                        files.forEach(element => {
                                            sp.web.getFolderByServerRelativeUrl(folder + '/SupportingDocument').files.getByName(element.Name).moveTo(folder + '/FileHistory/' + totalFiles + '_SupportingDocument/' + element.Name)
                                            //sp.web.getFileByUrl(this._siteURL+folder+'/SupportingDocument').copyByPath(this._siteURL+folder + '/FileHistory/' + totalFiles + '_SupportingDocument/',true)
                                        });
                                    });
                                })
                            }
                        });

                        if (doc.size <= 10485760) {
                            sp.web.getFolderByServerRelativeUrl(folder).files.add(doc.name, doc, true).then(f => {
                                f.file.getItem().then(fileItem => {
                                    fileItem.update({}).then((j) => { });
                                })
                            })
                        } else {
                            sp.web.getFolderByServerRelativeUrl(folder).files.addChunked(doc.name, doc).then(f => {
                                f.file.getItem().then(fileItem => {
                                    fileItem.update({}).then((j) => { });
                                })
                            })
                        }
                    });
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async UploadFilesToLibrarySupportingDoc(documents: any, folder: string): Promise<any> {
        try {
            for (const doc of documents) {
                await sp.web.getFolderByServerRelativeUrl(folder).files()
                    .then(() => {
                        if (doc.size <= 10485760) {
                            sp.web.getFolderByServerRelativeUrl(folder).files.add(doc.name, doc, true)
                        } else {
                            sp.web.getFolderByServerRelativeUrl(folder).files.addChunked(doc.name, doc)
                        }
                    });
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async CreateFileByBlobData(folderUrl: string, content: any, fileName: string): Promise<any> {
        try {
            return await sp.web.getFolderByServerRelativeUrl(folderUrl).files.add(fileName, content, true);
        } catch (error) {
            return Promise.reject(error);
        }

    }

    public async getAllFiles(folder: string) {
        try {
            return await sp.web.getFolderByServerRelativeUrl(folder).files()
        } catch (error) {
            return Promise.reject(error);
        }
    }


    public async CreateFolderinLibrary(folder: string, folderName: string) {
        const folderList = await sp.web.getFolderByServerRelativeUrl(folder).folders();
        const folderNames = folderList.map(x => x.Name);
        if (folderNames.indexOf(folderName) == -1) {
            return sp.web.getFolderByServerRelativeUrl(folder).folders.add(folderName);
        }
    }

    public async UploadFileToLibraryFolder(listName: string, folderName: string, fileName: string, content: any): Promise<any> {
        try {
            const folder = sp.web.lists.getByTitle(listName).rootFolder.folders.getByName(folderName);
            const file = await folder.files.add(fileName, content, true).then((f) => {
                return f.data;
            })
            return file;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async copyFile(fromFolder: string, toFolder: string, filename: string) {
        sp.web.getFolderByServerRelativeUrl(fromFolder).files.get().then(async files => {
            files.forEach(async element => {
                if (element.Name == filename) {
                    await sp.web.getFolderByServerRelativeUrl(toFolder).folders.add('FileHistory');

                    await sp.web.getFolderByServerRelativeUrl(toFolder).files.get().then(async files => {
                        files.forEach(element => {
                            sp.web.getFolderByServerRelativeUrl(toFolder + '/FileHistory').files.add(element.Name, element, true).then(f => {
                                f.file.getItem().then(fileItem => {
                                    fileItem.update({}).then((j) => { });
                                })
                            })
                            sp.web.getFolderByServerRelativeUrl(toFolder).files.getByName(element.Name).delete();
                        })
                    })

                    await sp.web.getFolderByServerRelativeUrl(toFolder).files.add(filename, element, true).then(f => {
                        f.file.getItem().then(fileItem => {
                            fileItem.update({}).then((j) => { });
                        })
                    })
                }
            });
        });
    }

    /**
     * Create folder in sharepoint library
     */
    public async CreateFolder(folderName: string, libName: string): Promise<any> {
        return sp.web.lists.getByTitle(libName).rootFolder.folders.add(folderName);
    }

    public async GetChoiceOptions(listName: string, fieldName: string): Promise<any> {
        try {
            return await sp.web.lists.getByTitle(listName).fields.filter("EntityPropertyName eq '" + fieldName + "'").get();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async UploadChunkedDocument(libName: string, fileRevisionNo: string, requestId: string, file: File, onProcess: Function, onSuccess: Function, onError: Function): Promise<any> {
        try {
            let siteurl = decodeURIComponent(this._siteURL);
            siteurl = siteurl.substr(-1) == "/" ? siteurl.substr(0, siteurl.length - 1) : siteurl;
            const folderPath: string = `${new URL(siteurl).pathname}/${libName}`;
            //const uuid = getGUID();
            //const guid = uuid.split('-').pop();

            let container = await sp.web.getFolderByServerRelativeUrl(folderPath).folders.add(requestId);
            let fileNameExt = file.name.split('.');
            let newFileName = fileRevisionNo != "" ? `${fileNameExt[0]}_${fileRevisionNo}.${fileNameExt[fileNameExt.length - 1]}` : file.name;
            return await sp.web.getFolderById(`${container.data.UniqueId}`).files.addChunked(newFileName, file, (process) => {
                onProcess && onProcess(process);
            }, true, 10240).then(success => {
                onSuccess && onSuccess(success);
            })
                .catch(e => {
                    onError && onError(e);
                })
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public getFileListItemAllFields = async (fileUrl: string) => {
        try {
            const file = await sp.web.getFileByServerRelativeUrl(fileUrl).listItemAllFields.get();
            return file;
        } catch (error) {
            console.error(error);
        }
    };

    public SendEmail(emailProperties: IEmailProperties) {
        sp.utility.sendEmail(emailProperties).then(() => {
            console.log('Email sent successfully');
        }).catch((error) => {
            console.log('Error sending email:', error);
        });
    }


    public async getFilteredItemsWithPagination(listName: string, queryColumns: string, filterQuery: string = "", expandFields: string = "", orderBy: string = "ID"): Promise<any[]> {
        const batchSize = 2000; // Number of items to fetch in each batch
        let items: any = [];
        let pagedItems = await sp.web.lists.getByTitle(listName).items.select(queryColumns).filter(filterQuery).top(batchSize).expand(expandFields).getPaged();
        items = pagedItems.results;
        while (pagedItems.hasNext) {
            pagedItems = await pagedItems.getNext();
            items.push(...pagedItems.results);
        }
        return items;
    }

    private getMaxIdForList = async (listname: string): Promise<number> => {
        let maxItems: any[] = await sp.web.lists.getByTitle(listname).items
            .select('ID')
            .orderBy('ID', false)
            .top(1)
            .get();
        if (maxItems.length > 0) return maxItems[0].ID;
        else return 0;
    };

    public async getLargeListItems(listName: string, queryColumns: string, filterQuery: string = "", expandFields: string = "", orderBy: string = "ID"): Promise<any[]> {
        let minid: number;
        let maxid: number;
        let listmaxid: number = await this.getMaxIdForList(listName);
        let maxPage: number = Math.ceil(listmaxid / this.ROW_LIMIT);
        let returnItems: any[] | PromiseLike<any[]> = [];
        for (var i = 0; i < maxPage; i++) {
            minid = i * this.ROW_LIMIT + 1;
            maxid = (i + 1) * this.ROW_LIMIT;
            console.log(`Min id: ${minid.toString()} - Max Id: ${maxid.toString()}`);
            let strfilterQuery = `(Id ge ${minid} and Id lt ${maxid}) and (${filterQuery})`
            let retitems: any = await sp.web.lists.getByTitle(listName).items.select(queryColumns).filter(strfilterQuery).top(this.ROW_LIMIT).expand(expandFields).get();
            if (retitems.length > 0) {
                returnItems = returnItems.concat(retitems);
            }
            if (i >= maxPage - 1) return returnItems;
        }
        return returnItems;
    }
}