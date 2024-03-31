import { Injectable, Inject, InjectionToken, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConsts } from '@shared/AppConsts';
import { Observable, of  } from 'rxjs';

import { map, share } from 'rxjs/operators';
import { ReturnStatement } from '@angular/compiler';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

@Injectable()
export class UtilsService {
    private baseUrl: string;
    private observable: Observable<any>;


    constructor(
        private http: HttpClient,
    ) {
        this.baseUrl = AppConsts.remoteServiceBaseUrl;
    }

    //仅仅支持{string:int}这样结构的枚举类型
    intEnumToKeyValue(stringEnum) {

        const keyValue = [];
        //const keys = Object.keys(stringEnum).filter((value, index) => {
        //    return !(index % 2);
        //});

        for (var item in stringEnum) {
            if (stringEnum.hasOwnProperty(item) && !/^\d+$/.test(item)) {
                keyValue.push({ key: item, value: stringEnum[item] });
                //console.log(item + ":" + stringEnum[item]);
            }
        }

        return keyValue;
    }

    //To Use:
    /*
        import { UtilsService } from "@shared/service-proxies/service-utils";

        private app;//声明app，包含枚举Dict等

        constructor(……)
        
        //初始化app，包含枚举Dict等
        this.utilsService.getAppData().subscribe(res => {
        this.app = res;
        });
    
        {{app.enums.enumType[record.enumType]}}
     or
        <select name="selectEnumType" class="form-control" [(ngModel)]="enumMain.enumType" [disabled]="enumMain.id">
                            <option *ngFor="let item of app.enums.enumType | keyValue" [value]="item.key">{{item.value}}</option>
                        </select>


    */
    //初始化AppData，得到枚举，实现缓存机制
    getAppData(isRefresh?: boolean) {
        if (isRefresh) {
            this.observable = null;
        }

        return this.http.get<any[]>(this.baseUrl + "/UnifyEnumProxies/get");

        //if (this.observable) {
        //    return this.observable;
        //} else {
        //    this.observable = this.http.get<any[]>(this.baseUrl + "/UnifyEnumProxies/get")
        //        .pipe();
        //    return this.observable;
        //}
    }

    //getHTML(): Observable<string> {
    //    return this.http.request('http://localhost:9600/UnifyEnumProxies/get').flatMap((response_: any) => {
    //        return this.processGet(response_);
    //    }).catch((response_: any) => {
    //        if (response_ instanceof Response) {
    //            try {
    //                return this.processGet(response_);
    //            } catch (e) {
    //                return <Observable<string>><any>Observable.throw(e);
    //            }
    //        } else
    //            return <Observable<string>><any>Observable.throw(response_);
    //    });
    //}
    //protected processGet(response: Response): Observable<string> {
    //    const status = response.status;
    //    debugger;
    //    let _headers: any = response.headers ? response.headers.toJSON() : {};
    //    if (status === 200) {
    //        const _responseText = response.text();
    //        let result200: any = null;
    //        let resultData200 = _responseText === "" ? null : _responseText;
    //        result200 = resultData200; //? EntityAttributeDto.fromJS(resultData200) : new EntityAttributeDto();
    //        return Observable.of(result200);
    //    } else if (status !== 200 && status !== 204) {
    //        const _responseText = response.text();
    //        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    //    }
    //    return Observable.of<string>(<any>null);
    //}

    //根据enumList既（this.app）和枚举名称获得位域型枚举的配套数组
    getFlagsEnumList(enumList: any, enumName: string): { [index: number]: boolean } {
        for (let key in enumList.enums) {
            if (key == enumName) {
                let result: { [index: number]: boolean } = {};
                for (let enumIndex in enumList.enums[key]) {
                    result[enumIndex] = false;
                }
                return result;
            }
        }
    }
}
