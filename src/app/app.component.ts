import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CampaignModel } from './model/Campaign';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  campaignForm: FormGroup = new FormGroup({});
  campaignObj: CampaignModel = new CampaignModel();
  campaignList: CampaignModel[] = [];
  emeraldAccountFunds: number = 1000;

  constructor() {
    this.createForm();
    const oldData = localStorage.getItem('IdData');
    if (oldData != null) {
      const currentData = JSON.parse(oldData);
      this.campaignList = currentData;
    }
  }

  createForm() {
    this.campaignForm = new FormGroup({
      id: new FormControl(this.campaignObj.id),
      name: new FormControl(this.campaignObj.name, [Validators.required]),
      keywords: new FormControl(this.campaignObj.keywords, [
        Validators.required,
      ]),
      bidAmount: new FormControl(this.campaignObj.bidAmount, [
        Validators.required,
        Validators.min(1),
      ]),
      campaignFund: new FormControl(this.campaignObj.campaignFund, [
        Validators.required,
      ]),
      status: new FormControl(this.campaignObj.status, [Validators.required]),
      town: new FormControl(this.campaignObj.town, [Validators.required]),
      radius: new FormControl(this.campaignObj.radius, [
        Validators.required,
        Validators.min(0),
      ]),
    });
  }

  onSave() {
    if (this.campaignForm.invalid) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    const fundValue = this.campaignForm.controls['campaignFund'].value;
    if (fundValue > this.emeraldAccountFunds) {
      alert('Insufficient funds in your Emerald account.');
      return;
    }

    this.emeraldAccountFunds -= fundValue;
    const oldData = localStorage.getItem('IdData');
    if (oldData != null) {
      const currentData = JSON.parse(oldData);
      this.campaignList = currentData;
      this.campaignForm.controls['id'].setValue(currentData.length + 1);
    }
    this.campaignList.unshift(this.campaignForm.value);
    localStorage.setItem('IdData', JSON.stringify(this.campaignList));
    this.campaignObj = new CampaignModel();
    this.createForm();
  }

  onEdit(item: CampaignModel) {
    this.campaignObj = item;
    this.createForm();
  }

  onUpdate() {
    if (this.campaignForm.invalid) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    const fundValue = this.campaignForm.controls['campaignFund'].value;
    const oldRecord = this.campaignList.find(
      (m) => m.id == this.campaignForm.controls['id'].value,
    );

    if (oldRecord != undefined) {
      const fundDifference = fundValue - oldRecord.campaignFund;
      if (fundDifference > this.emeraldAccountFunds) {
        alert('Insufficient funds in your Emerald account.');
        return;
      }
      this.emeraldAccountFunds -= fundDifference;

      oldRecord.name = this.campaignForm.controls['name'].value;
      oldRecord.bidAmount = this.campaignForm.controls['bidAmount'].value;
      oldRecord.campaignFund = this.campaignForm.controls['campaignFund'].value;
      oldRecord.status = this.campaignForm.controls['status'].value;
      oldRecord.town = this.campaignForm.controls['town'].value;
      oldRecord.radius = this.campaignForm.controls['radius'].value;
    }
    localStorage.setItem('IdData', JSON.stringify(this.campaignList));
    this.campaignObj = new CampaignModel();
    this.createForm();
  }

  onDelete(id: number) {
    const isDelete = confirm('Are you sure you want to delete?');
    if (isDelete) {
      const index = this.campaignList.findIndex((m) => m.id == id);
      if (index > -1) {
        const deletedFund = this.campaignList[index].campaignFund;
        this.emeraldAccountFunds += deletedFund;
        this.campaignList.splice(index, 1);
        localStorage.setItem('IdData', JSON.stringify(this.campaignList));
      }
    }
  }
}
