import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { BkashTransaction } from './parser.service';
import * as path from 'path';

@Injectable()
export class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId = '1_xFiuC073JUaTQDQqdqgjBKdAWbtS73KDslDruRDz_w';

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../../src/credentials.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async appendTransaction(tx: BkashTransaction) {
    const values = [[tx.number, tx.amount, tx.trxId, tx.date, tx.time , tx.reference, tx.balance]];

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Sheet1!A:E',
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  }
}
