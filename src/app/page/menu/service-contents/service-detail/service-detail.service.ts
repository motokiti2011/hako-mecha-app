import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';
import { userFavorite } from 'src/app/entity/userFavorite';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { ApiCheckService } from 'src/app/page/service/api-check.service';
import { image } from 'src/app/entity/image';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import {
  find as _find,
} from 'lodash';
import { userWorkArea, mechanicWorkArea } from '../service-create/service-create-option';

@Injectable({
  providedIn: 'root'
})
export class ServiceDetailService {

  constructor(
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
    private apiCheckService: ApiCheckService
  ) { }

  /**
   * 詳細表示する伝票情報を取得する
   * @param slipNo
   * @returns
   */
  public getService(slipNo: string, serviceType: string): Observable<any> {
    if (serviceType !== '0') {
      return this.apiUniqueService.getServiceContents(slipNo);
    }
    return this.apiUniqueService.getSlip(slipNo);
  }

  /**
   * 画像に番号を振り、表示用リストに格納する。
   * @param thumbnailUrl
   * @param imageList
   * @returns
   */
  public setImages(thumbnailUrl: string, imageList: string[]): image[] {

    let resultList: image[] = [];
    // サムネイル画像が存在しない場合画像はなし
    if (thumbnailUrl == '' || thumbnailUrl == null) {
      const noImage: image = {
        imageNo: '', src: 'assets/images/noimage.png'
      }
      resultList.push(noImage);
      return resultList;
    } else {
      const item: image = {
        imageNo: String(0), src: thumbnailUrl
      }
      resultList.push(item);
    }

    if (imageList.length == 0) {
      const noImage: image = {
        imageNo: '', src: 'assets/images/noimage.png'
      }
      resultList.push(noImage)
    }
    let count = 0;
    imageList.forEach(image => {
      const item: image = {
        imageNo: String(count), src: image
      }
      resultList.push(item);
      count++;
    });
    return resultList;
  }




  /**
   * お気に入り情報を追加する
   * @param service
   * @param userId
   * @returns
   */
  public addFavorite(service: salesServiceInfo, userId: string): Observable<any> {
    const favorite: userFavorite = {
      id: '', // ID
      userId: userId, // ユーザーID
      slipNo: service.slipNo, // 伝票番号
      title: service.title, // タイトル
      price: service.price, // 価格
      whet: '', // 期間
      serviceType: service.targetService, // サービスタイプ
      endDate:service.completionDate, // 終了日
      imageUrl: service.thumbnailUrl, // 画像url
      created: '',// 作成日時
      updated: '',      // 更新日時
    }
    return this.apiService.postFavorite(favorite);
  }

  /**
   * サービス情報の日付データから画面表示用に加工する。
   * @param ymd
   */
  public setDispYMD(ymd:string):Date {
    // 年月日を取得
    console.log(ymd);
    const ymdst = String(ymd);
    const year = ymdst.slice(0,4)
    const month = ymdst.slice(5,6)
    const day = ymdst.slice(7,9)
    console.log('year:'+year)
    console.log('month:'+month)
    console.log('day:'+day)
    return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0); // 2022年5月5日6時35分20.333秒を設定


    return new Date(2022, 5 - 1, 5, 6, 35, 20, 333); // 2022年5月5日6時35分20.333秒を設定
  }

  /**
   * サービス情報の日付データから画面表示用に加工する。
   * @param ymd
   */
  public setDispYMDSt(ymd: number): string {
    // 年月日を取得
    console.log(ymd);

    const ymdst = String(ymd);
    const stYear = ymdst.slice(0,4)
    const stMonth = ymdst.slice(5,6)
    const stDay = ymdst.slice(6,9)
    console.log('year:'+stYear)
    console.log('month:'+stMonth)
    console.log('day:'+stDay)
    // 月、日付は先頭0の場合があるので一旦数値型に戻す
    const month = Number(stMonth);
    const day = Number(stDay);

    return stYear + '年' + String(month) + '月' + String(day) + '日'


    // return new Date(2022, 5 - 1, 5, 6, 35, 20, 333); // 2022年5月5日6時35分20.333秒を設定
  }

  /**
   * 表示用地域情報を設定する
   * @param areaNo1
   * @param areaNo2
   */
  public setDispArea(areaNo1:string, areaNo2: string | null): string {
    const area1Data = _find(prefecturesCoordinateData, data => data.code == areaNo1);
    if(area1Data) {

      return area1Data.prefectures + ' ' + areaNo2;
    }
    return '';
  }

  /**
   * 作業場所情報を設定する
   * @param workAreaInfo 
   * @param serviceType 
   */
  public setDispWorkArea(workAreaInfo: string, serviceType: string): string {
    let result = '';
    if(serviceType == '0') {
      const workArea = _find(userWorkArea, data => data.id == workAreaInfo);
      if(workArea) {
        result = workArea.viewDisp;
      }
    } else {
      const workArea = _find(mechanicWorkArea, data => data.id == workAreaInfo);
      if(workArea) {
        result = workArea.viewDisp;
      }
    }
    return result;
  }



  /**
   * アクセスユーザーが伝票管理者かをチェックする
   * @param accessId 
   */
  public acsessUserAdminCheck(adminId: string, serviceType: string, accessId: string): Observable<any>  {
    return this.apiCheckService.checkAcceseAdmin(adminId, serviceType, accessId);
  }



}
