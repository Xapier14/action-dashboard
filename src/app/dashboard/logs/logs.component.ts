import { Component, OnInit } from '@angular/core';
import { LogData, LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  displayedItems: number = 0;
  totalItems: number = 0;
  currentPage: number = 1;
  pageCount: number = 1;
  logsData: LogData[] | undefined = [];

  constructor(private logsService: LogsService) {
    this.logsService.reset();
  }

  async ngOnInit(): Promise<void> {
    await this.updateDataview();
    this.logsService.clearFilter();
    this.logsService.setAutoIncrement(false);
  }

  navFirstPage() {
    this.logsService.setCurrentPage(0);
    this.updateDataview();
  }
  navPrevPage() {
    this.logsService.decrementPage();
    this.updateDataview();
  }
  navNextPage() {
    this.logsService.incrementPage();
    this.updateDataview();
  }
  navLastPage() {
    this.logsService.setCurrentPage(this.pageCount - 1);
    this.updateDataview();
  }

  async updateDataview() {
    console.log('updateDataview');
    this.logsData = undefined;
    let newData: LogData[] = [];

    const reports = await this.logsService.getListDataAsync();
    reports.forEach((report: any) => {
      newData.push({
        sourceIp: report.sourceIp,
        dateTime: new Date(report.dateTime),
        message: report.message,
        level: report.level,
        sessionId: report.sessionId,
        userId: report.userId,
        action: report.action,
      });
    });
    this.currentPage = this.logsService.getCurrentPage() + 1;
    this.pageCount = this.logsService.getCachedMax() + 1;
    this.displayedItems = newData.length;
    this.totalItems = this.logsService.getCachedTotal();
    this.logsData = newData;
    // console.log(this.reportsData);
  }

  async refresh(keepCurrentPage: boolean = true) {
    if (!keepCurrentPage) this.logsService.setCurrentPage(0);
    await this.updateDataview();
  }
}
