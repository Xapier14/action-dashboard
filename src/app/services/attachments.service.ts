import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

export interface Attachment {
  fileName: string;
  contentType: string;
  accessToken: string;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AttachmentsService {
  private cache: Map<string, Attachment> = new Map();
  constructor(
    private authService: AuthService,
    private httpService: HttpService
  ) {}

  async GetAttachmentAsync(
    id: string,
    isThumbnail: boolean
  ): Promise<Attachment> {
    const localId = `${id}-${isThumbnail}`;
    if (this.cache.has(localId)) {
      return this.cache.get(localId)!;
    } else {
      const requestUrl = `attachments/${id}`;
      const requestData = new URLSearchParams();
      if (isThumbnail) requestData.append('thumbnail', 'true');
      const token = await this.authService.getTokenAsync();
      if (!token) throw new Error('No token available.');
      const response = await (
        await this.httpService.getAsync(requestUrl, requestData, token)
      ).json();

      const attachment = {
        fileName: response.fileName,
        contentType: response.contentType,
        accessToken: response.accessToken,
        expiresAt: response.expires,
      };
      this.cache.set(localId, attachment);

      const dateOffset = new Date(attachment.expiresAt).getTime() - Date.now();
      setTimeout(() => {
        this.cache.delete(localId);
      }, dateOffset - 60000);

      return attachment;
    }
  }

  async GetAttachmentUrlAsync(attachment: Attachment) {
    const token = await this.authService.getTokenAsync();
    if (!token) throw new Error('No token available.');
    const requestUrl = `${environment.apiHost}/attachments/file/${attachment.fileName}`;
    const requestData = new URLSearchParams();
    requestData.append('a', attachment.accessToken);
    return `${requestUrl}?${requestData.toString()}`;
  }

  async GetAttachmentUrlAsyncById(id: string, isThumbnail: boolean) {
    const attachment = await this.GetAttachmentAsync(id, isThumbnail);
    return await this.GetAttachmentUrlAsync(attachment);
  }

  async GetAttachmentsFromReportAsync(reportId: string): Promise<string[]> {
    const requestUrl = `attachments/from/${reportId}`;
    const token = await this.authService.getTokenAsync();
    if (!token) throw new Error('No token available.');
    const response = await (
      await this.httpService.getAsync(requestUrl, undefined, token)
    ).json();
    return response;
  }
}
