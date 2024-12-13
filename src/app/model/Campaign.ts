export class CampaignModel {
  id: number = 1;
  name: string = '';
  keywords: string[] = [];
  bidAmount: number = 0;
  campaignFund: number = 0;
  status: boolean = true;
  town: string = '';
  radius: number = 0;

  constructor() {
    this.id = 1;
    this.name = '';
    this.keywords = [];
    this.bidAmount = 0;
    this.campaignFund = 0;
    this.status = true;
    this.town = '';
    this.radius = 0;
  }
}
