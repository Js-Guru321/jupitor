import { Component, OnInit } from '@angular/core';
import { Router, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarService } from '../sidebar.service';
import { TaxiService } from '../shared/taxi.service';
import { EventsService } from '../core/services/events.service';
import { ToasterService } from '../../../node_modules/angular2-toaster';
import { TripService } from '../trip/trip.service';
import { element } from '@angular/core/src/render3/instructions';
import { p } from '@angular/core/src/render3';



@Component({
  selector: 'app-adminlist',
  templateUrl: './adminlist.component.html',
  styleUrls: ['./adminlist.component.css']
})
export class AdminlistComponent implements OnInit {

	public doughnutChartLabels: string[] = [];
	public doughnutChartData: number[] = [];
	public doughnutChartType: string = 'doughnut';

	public barChartLabels: string[] = [];
	public barChartData: number[] = [];
	public barChartType: string = 'bar'; 
	public barChartLegend = true;

	[x: string]: any;
	
  userId: any;
  output: Object;
  outputdata: any;
	admin: any;
	data: any;		
		
  constructor(
    private router: Router,
		private http: HttpClient,
		public sidebar: SidebarService,
		public taxiService: TaxiService,
		public toasterService: ToasterService,
		public eventsService: EventsService,
		public tripService: TripService

	  ) {
    this.userId = localStorage.getItem('userId');
    console.log("Userid", this.userId);
   }
   
  ngOnInit() {
	this.sidebar.show();
	
	}
		
	searchValue:string = '';
  clearSearch() {
		this.searchValue = null;
	}
	onShow(id) {
		this.tripService.getDriver(id).subscribe((res: any) => {
			this.outputdata = res.data;
			this.myProfile = this.outputdata;
			let obj = {};
			res.data.forEach(element => {
				obj[element.updatedOn] = 0;
				var time_to_show = element.updatedOn;//1509968436;  unix timestamp in seconds
				var t = new Date(time_to_show * 1000);
				//var formatted = t.format("dd.mm.yyyy hh:MM:ss");
				var formatted = ('0' + t.getDate()).slice(0) + '.' + ('0' + t.getMonth()).slice(0) + '.' + ('0' + t.getFullYear()).slice(0) + ',' + ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
				var timestamp = element.updatedOn,
				date = new Date(timestamp * 1000),
				datevalues = [
					date.getUTCFullYear(),
					date.getMonth()+1,
					date.getDate(),
					date.getHours(),
					date.getMinutes(),
					date.getSeconds(),
				];
			});
			for (let k in obj) {
				res.data.forEach(element => {
					if (k === element.updatedOn) {
						obj[k] = obj[k] + 1;
					}
				});
			}
			this.types = obj;
			this.Taxi = this.types.price;
			for (let k in obj) {
				this.doughnutChartLabels.push(k);
				this.doughnutChartData.push(obj[k]);
				this.barChartLabels.push(k);
				this.barChartData.push(obj[k]);
			}
			this.showMyTaxisChart = true;

			this. clearSearch();
			this.eventsService.broadcast('loader:hide');
		}, err => {
			this.eventsService.broadcast('loader:hide');
		});
	}
}

