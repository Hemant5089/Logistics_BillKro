import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma/prisma.service';

import { Response } from 'express';

import PDFDocument from 'pdfkit';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InvoicePdfService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // GENERATE PDF
  // =========================================================

  async generatePdf(
    sellerId: string,
    billingMonth: string,
    invoicePrefix: string,
    invoiceNumber: string,
    userId: string,
    res: Response,
  ) {
    // =======================================================
    // LOAD USER / COMPANY
    // =======================================================

    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    // =======================================================
    // LOAD SELLER
    // =======================================================

    const seller =
      await this.prisma.seller.findUnique({
        where: {
          id: sellerId,
        },
      });

    if (!seller) {
      throw new NotFoundException(
        'Seller not found',
      );
    }

    // =======================================================
    // LOAD BILLING RECORDS
    // =======================================================

    const records =
      await this.prisma.billingRecord.findMany({
        where: {
          sellerId,
          billingMonth,
        },
      });

    if (records.length === 0) {
      throw new NotFoundException(
        'No billing records found for this seller and month.',
      );
    }

    // =======================================================
    // INVOICE NUMBER
    // =======================================================

    const invoiceNo =
      `${invoicePrefix || ''}${invoiceNumber || ''}`;

    if (!invoiceNo) {
      throw new NotFoundException(
        'Invoice number is required.',
      );
    }

    // =======================================================
    // TAXABLE AMOUNT
    // =======================================================

    const taxableAmount =
      records.reduce(
        (sum, record) =>
          sum + Number(record.totalCharge || 0),
        0,
      );

    // =======================================================
    // GST CALCULATION
    //
    // Same State:
    // CGST 9%
    // SGST 9%
    //
    // Different State:
    // IGST 18%
    // =======================================================

    const fromState =
      (user.state || '')
        .trim()
        .toLowerCase();

    const toState =
      (seller.state || '')
        .trim()
        .toLowerCase();

    const isSameState =
      fromState.length > 0 &&
      toState.length > 0 &&
      fromState === toState;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isSameState) {
      cgst =
        taxableAmount * 0.09;

      sgst =
        taxableAmount * 0.09;
    } else {
      igst =
        taxableAmount * 0.18;
    }

    // =======================================================
    // GRAND TOTAL
    // =======================================================

    const grandTotal =
      taxableAmount +
      cgst +
      sgst +
      igst;

    // =======================================================
    // STATE CODE
    // =======================================================

    const fromStateCode =
      this.getStateCode(
        user.gstNumber,
      );

    const toStateCode =
      this.getStateCode(
        seller.gstNumber,
      );

    // =======================================================
    // LOAD LOGO / SIGNATURE
    // =======================================================

    const logo =
      await this.loadImage(
        user.logoUrl,
      );

    const signature =
      await this.loadImage(
        user.signatureUrl,
      );

    // =======================================================
    // PDF DOCUMENT
    // =======================================================

    const doc =
      new PDFDocument({
        size: 'A4',

        margin: 40,

        bufferPages: true,
      });

    // =======================================================
    // RESPONSE
    // =======================================================

    res.setHeader(
      'Content-Type',
      'application/pdf',
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Tax_Invoice_${invoiceNo}_${billingMonth}.pdf`,
    );

    doc.pipe(res);

    // =======================================================
    // PAGE CONSTANTS
    // =======================================================

    const pageWidth =
      595.28;

    const pageHeight =
      841.89;

    const left =
      40;

    const right =
      pageWidth - 40;

    const contentWidth =
      right - left;

    // =======================================================
    // HEADER
    // =======================================================

    doc
      .font('Helvetica')
      .fontSize(12)
      .fillColor('#000000')
      .text(
        'Tax Invoice',
        left,
        28,
        {
          width: contentWidth,
          align: 'center',
          underline: true,
        },
      );

    // =======================================================
    // LOGO
    // =======================================================

   if (logo) {
  try {
    doc.image(
      logo,
      left,
      50,
      {
        fit: [125, 55],
      },
    );
  } catch (error) {
    console.log(
      'Unable to render company logo:',
      error,
    );
  }
}else {
      // Fallback company name
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(
          user.companyName ||
            user.name,
          left,
          58,
          {
            width: 160,
          },
        );
    }

    // =======================================================
    // INVOICE DETAILS - TOP RIGHT
    // =======================================================

    const invoiceDetailsX =
      385;

    const invoiceDetailsWidth =
      170;

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        `Invoice No: ${invoiceNo}`,
        invoiceDetailsX,
        55,
        {
          width: invoiceDetailsWidth,
          align: 'right',
        },
      );

    doc
      .font('Helvetica')
      .fontSize(8)
      .text(
        `Invoice Date: ${this.formatDate(
          new Date(),
        )}`,
        invoiceDetailsX,
        67,
        {
          width: invoiceDetailsWidth,
          align: 'right',
        },
      );

    doc
      .text(
        `Invoice Period: ${this.getInvoicePeriod(
          billingMonth,
        )}`,
        invoiceDetailsX,
        79,
        {
          width: invoiceDetailsWidth,
          align: 'right',
        },
      );

    // =======================================================
    // FROM / TO
    // =======================================================

    const partyTop =
      105;

    const fromX =
      40;

    const toX =
      315;

    const partyWidth =
      235;

    // FROM
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        'From:',
        fromX,
        partyTop,
      );

    let fromY =
      partyTop + 16;

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        user.companyName ||
          user.name,
        fromX,
        fromY,
        {
          width: partyWidth,
          lineGap: 1,
        },
      );

    fromY +=
      this.getTextHeight(
        user.companyName ||
          user.name,
        partyWidth,
        8,
        true,
      ) + 4;

    const fromAddress =
      this.buildAddress(
        user.address,
        user.city,
        user.state,
        user.pincode,
      );

    if (fromAddress) {
      doc
        .font('Helvetica')
        .fontSize(8)
        .text(
          fromAddress,
          fromX,
          fromY,
          {
            width: partyWidth,
            lineGap: 1,
          },
        );

      fromY +=
        this.getTextHeight(
          fromAddress,
          partyWidth,
          8,
        ) + 4;
    }

    if (user.gstNumber) {
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(
          `GSTIN: ${user.gstNumber}`,
          fromX,
          fromY,
          {
            width: partyWidth,
          },
        );

      fromY += 12;
    }

    // TO
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        'To:',
        toX,
        partyTop,
      );

    let toY =
      partyTop + 16;

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        seller.sellerName,
        toX,
        toY,
        {
          width: partyWidth,
          lineGap: 1,
        },
      );

    toY +=
      this.getTextHeight(
        seller.sellerName,
        partyWidth,
        8,
        true,
      ) + 3;

    if (seller.companyName) {
      doc
        .font('Helvetica')
        .fontSize(8)
        .text(
          seller.companyName,
          toX,
          toY,
          {
            width: partyWidth,
          },
        );

      toY +=
        this.getTextHeight(
          seller.companyName,
          partyWidth,
          8,
        ) + 3;
    }

    const sellerAddress =
      this.buildAddress(
        seller.address,
        seller.city,
        seller.state,
        seller.pincode,
      );

    if (sellerAddress) {
      doc
        .font('Helvetica')
        .fontSize(8)
        .text(
          sellerAddress,
          toX,
          toY,
          {
            width: partyWidth,
            lineGap: 1,
          },
        );

      toY +=
        this.getTextHeight(
          sellerAddress,
          partyWidth,
          8,
        ) + 3;
    }

    if (seller.phone) {
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(
          `MOBILE: ${seller.phone}`,
          toX,
          toY,
          {
            width: partyWidth,
          },
        );

      toY += 12;
    }

    if (seller.gstNumber) {
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(
          `GST: ${seller.gstNumber}`,
          toX,
          toY,
          {
            width: partyWidth,
          },
        );

      toY += 12;
    }

    if (seller.state) {
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(
          `PLACE OF SUPPLY: ${seller.state}`,
          toX,
          toY,
          {
            width: partyWidth,
          },
        );

      toY += 12;
    }

    if (toStateCode) {
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(
          `STATE CODE: ${toStateCode}`,
          toX,
          toY,
          {
            width: partyWidth,
          },
        );

      toY += 12;
    }

    // =======================================================
    // TAX TABLE
    // =======================================================

    const tableTop =
      Math.max(
        fromY,
        toY,
      ) + 25;

    const descriptionX =
      40;

    const amountX =
      330;

    const descriptionWidth =
      290;

    const amountWidth =
      225;

    const headerHeight =
      20;

    const rowHeight =
      24;

    // =======================================================
    // TABLE HEADER
    // =======================================================

    doc
      .rect(
        descriptionX,
        tableTop,
        contentWidth,
        headerHeight,
      )
      .fillAndStroke(
        '#eeeeee',
        '#555555',
      );

    doc
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        'Description',
        descriptionX + 7,
        tableTop + 6,
        {
          width:
            descriptionWidth - 14,
        },
      );

    doc
      .text(
        'Amount',
        amountX,
        tableTop + 6,
        {
          width:
            amountWidth - 7,
          align: 'right',
        },
      );

    // =======================================================
    // SHIPPING CHARGES
    // =======================================================

    let rowY =
      tableTop +
      headerHeight;

    this.drawTableRow(
      doc,
      descriptionX,
      amountX,
      descriptionWidth,
      amountWidth,
      rowY,
      rowHeight,
      'Shipping Charges (HSN Code - 996812)',
      this.money(taxableAmount),
    );

    rowY += rowHeight;

    // =======================================================
    // GST
    // =======================================================

    if (isSameState) {
      // CGST

      this.drawTableRow(
        doc,
        descriptionX,
        amountX,
        descriptionWidth,
        amountWidth,
        rowY,
        rowHeight,
        'CGST @ 9%',
        this.money(cgst),
      );

      rowY += rowHeight;

      // SGST

      this.drawTableRow(
        doc,
        descriptionX,
        amountX,
        descriptionWidth,
        amountWidth,
        rowY,
        rowHeight,
        'SGST/UTGST @ 9%',
        this.money(sgst),
      );

      rowY += rowHeight;
    } else {
      // IGST

      this.drawTableRow(
        doc,
        descriptionX,
        amountX,
        descriptionWidth,
        amountWidth,
        rowY,
        rowHeight,
        'IGST @ 18%',
        this.money(igst),
      );

      rowY += rowHeight;
    }

    // =======================================================
    // NET PAYABLE
    // =======================================================

    const payableY =
      rowY + 12;

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        'Net Payable:',
        350,
        payableY,
        {
          width: 100,
          align: 'right',
        },
      );

    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(
        this.money(grandTotal),
        455,
        payableY,
        {
          width: 100,
          align: 'right',
        },
      );

    // =======================================================
    // PAYMENT NOTE
    // =======================================================

    const noteY =
      payableY + 38;

    doc
      .font('Helvetica')
      .fontSize(7)
      .text(
        'Kindly remit the net payable amount to the below mentioned account.',
        left,
        noteY,
        {
          width: 280,
          lineGap: 1,
        },
      );

    doc
      .text(
        '(Ignore if already paid)',
        left,
        noteY + 12,
        {
          width: 280,
        },
      );

    // =======================================================
    // OPTIONAL PAYMENT INFORMATION
    // =======================================================

    doc
      .font('Helvetica')
      .fontSize(7)
      .text(
        'Kindly Login to https://admin.billkro.com using your registered user ID and',
        left,
        noteY + 32,
        {
          width: 280,
        },
      );

    doc
      .text(
        'password and recharge your wallet with payable amount.',
        left,
        noteY + 43,
        {
          width: 280,
        },
      );

    // =======================================================
    // AUTHORISED SIGNATURE
    // =======================================================

    const signatureX =
      350;

    const signatureWidth =
      205;

    const signatureY =
      noteY + 5;

    doc
      .font('Helvetica')
      .fontSize(7)
      .text(
        `For, ${user.companyName || user.name}`,
        signatureX,
        signatureY,
        {
          width: signatureWidth,
          align: 'right',
        },
      );

    // =======================================================
    // SIGNATURE IMAGE
    // =======================================================

    if (signature) {
      try {
        doc.image(
          signature,
          signatureX + 80,
          signatureY + 18,
          {
            fit: [120, 55],
            align: 'center',
            valign: 'center',
          },
        );
      } catch (error) {
        console.log(
          'Unable to render signature:',
          error,
        );
      }
    }

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        'Authorised Signatory',
        signatureX,
        signatureY + 78,
        {
          width: signatureWidth,
          align: 'right',
        },
      );

    // =======================================================
    // FOOTER LINE
    // =======================================================

    const footerLineY =
      750;

    doc
      .strokeColor('#777777')
      .lineWidth(0.5)
      .moveTo(
        left,
        footerLineY,
      )
      .lineTo(
        right,
        footerLineY,
      )
      .stroke();

    // =======================================================
    // REGISTERED OFFICE
    // =======================================================

    const registeredAddress =
      this.buildAddress(
        user.address,
        user.city,
        user.state,
        user.pincode,
      );

    doc
      .fillColor('#000000')
      .font('Helvetica')
      .fontSize(7)
      .text(
        `Regd. Office: ${registeredAddress}`,
        left,
        footerLineY + 10,
        {
          width: contentWidth,
          align: 'center',
        },
      );

    // =======================================================
    // FOOTER
    // =======================================================

    doc
      .fontSize(7)
      .text(
        'This is a computer generated invoice. No signature is required.',
        left,
        footerLineY + 25,
        {
          width: contentWidth,
          align: 'center',
        },
      );

    // =======================================================
    // END PDF
    // =======================================================

    doc.end();
  }

  // =========================================================
  // DRAW TABLE ROW
  // =========================================================

  private drawTableRow(
    doc: PDFKit.PDFDocument,
    descriptionX: number,
    amountX: number,
    descriptionWidth: number,
    amountWidth: number,
    y: number,
    height: number,
    description: string,
    amount: string,
  ) {
    doc
      .rect(
        descriptionX,
        y,
        descriptionWidth,
        height,
      )
      .stroke();

    doc
      .rect(
        amountX,
        y,
        amountWidth,
        height,
      )
      .stroke();

    doc
      .fillColor('#000000')
      .font('Helvetica')
      .fontSize(8)
      .text(
        description,
        descriptionX + 7,
        y + 7,
        {
          width:
            descriptionWidth - 14,
        },
      );

    doc
      .font('Helvetica')
      .fontSize(8)
      .text(
        amount,
        amountX,
        y + 7,
        {
          width:
            amountWidth - 7,
          align: 'right',
        },
      );
  }

  // =========================================================
  // MONEY
  // =========================================================

 private money(
  amount: number,
): string {
  return `Rs. ${Number(amount || 0).toFixed(2)}`;
}
  // =========================================================
  // BUILD ADDRESS
  // =========================================================

  private buildAddress(
    address?: string | null,
    city?: string | null,
    state?: string | null,
    pincode?: string | null,
  ): string {
    const parts = [
      address,
      city,
      state,
      pincode
        ? pincode
        : null,
    ].filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== '',
    );

    if (parts.length === 0) {
      return '';
    }

    return parts.join(', ');
  }

  // =========================================================
  // TEXT HEIGHT
  // =========================================================

  private getTextHeight(
    text: string,
    width: number,
    fontSize: number,
    bold = false,
  ): number {
    const tempDoc =
      new PDFDocument({
        size: 'A4',
      });

    tempDoc
      .font(
        bold
          ? 'Helvetica-Bold'
          : 'Helvetica',
      )
      .fontSize(fontSize);

    const height =
      tempDoc.heightOfString(
        text,
        {
          width,
        },
      );

    tempDoc.end();

    return height;
  }

  // =========================================================
  // DATE
  // =========================================================

  private formatDate(
    date: Date,
  ): string {
    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  }

  // =========================================================
  // INVOICE PERIOD
  // =========================================================

  private getInvoicePeriod(
    billingMonth: string,
  ): string {
    if (!billingMonth) {
      return '';
    }

    // Expected:
    // 2026-09
    //
    // Output:
    // 1 Sep 2026 To 30 Sep 2026

    const match =
      billingMonth.match(
        /^(\d{4})-(\d{1,2})$/,
      );

    if (!match) {
      return billingMonth;
    }

    const year =
      Number(match[1]);

    const month =
      Number(match[2]);

    if (
      month < 1 ||
      month > 12
    ) {
      return billingMonth;
    }

    const firstDate =
      new Date(
        year,
        month - 1,
        1,
      );

    const lastDate =
      new Date(
        year,
        month,
        0,
      );

    return `${firstDate.getDate()} ${firstDate.toLocaleDateString(
      'en-IN',
      { month: 'short' },
    )} ${year} To ${lastDate.getDate()} ${lastDate.toLocaleDateString(
      'en-IN',
      { month: 'short' },
    )} ${year}`;
  }

  // =========================================================
  // GST STATE CODE
  // =========================================================

  private getStateCode(
    gstNumber?: string | null,
  ): string {
    if (!gstNumber) {
      return '';
    }

    const gst =
      gstNumber.trim();

    if (
      gst.length >= 2 &&
      /^\d{2}/.test(gst)
    ) {
      return gst.substring(0, 2);
    }

    return '';
  }

  // =========================================================
  // LOAD IMAGE
  //
  // Supports:
  // 1. Local filesystem path
  // 2. data:image/... URL
  // 3. HTTP/HTTPS URL
  // =========================================================

  private async loadImage(
    imageUrl?: string | null,
  ): Promise<Buffer | string | null> {
    if (!imageUrl) {
      return null;
    }

    try {
      // -----------------------------------------------------
      // DATA URL
      // -----------------------------------------------------

      if (
        imageUrl.startsWith(
          'data:image/',
        )
      ) {
        const base64 =
          imageUrl.split(',')[1];

        if (!base64) {
          return null;
        }

        return Buffer.from(
          base64,
          'base64',
        );
      }

      // -----------------------------------------------------
      // HTTP / HTTPS
      // -----------------------------------------------------

      if (
        imageUrl.startsWith(
          'http://',
        ) ||
        imageUrl.startsWith(
          'https://',
        )
      ) {
        const response =
          await fetch(imageUrl);

        if (!response.ok) {
          console.log(
            `Unable to download image: ${imageUrl}`,
          );

          return null;
        }

        const arrayBuffer =
          await response.arrayBuffer();

        return Buffer.from(
          arrayBuffer,
        );
      }

      // -----------------------------------------------------
      // LOCAL FILE
      // -----------------------------------------------------

      let filePath =
        imageUrl;

      // Convert relative path to absolute
      if (
        !path.isAbsolute(
          filePath,
        )
      ) {
        filePath =
          path.resolve(
            process.cwd(),
            filePath,
          );
      }

      if (
        !fs.existsSync(
          filePath,
        )
      ) {
        console.log(
          `Image file not found: ${filePath}`,
        );

        return null;
      }

      return fs.readFileSync(
        filePath,
      );
    } catch (error) {
      console.log(
        'Image loading failed:',
        error,
      );

      return null;
    }
  }
}