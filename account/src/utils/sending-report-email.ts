// firestoreUtils.ts
import { firebaseAdmin } from '../index';
import { AccountDocument } from '../models/account';
import { ReportDocument } from '../models/report';

interface ReportDetails {
  report: ReportDocument,
  reportUser: AccountDocument,
  reportedUser: AccountDocument,
}

export const sendReportEmail = async (reportDetails: ReportDetails) => {
  try {
    await firebaseAdmin.firestore().collection('mail').add({
      to: 'uniplanet.info@gmail.com',
      message: {
        subject: 'Report is created',
        text: `
          \nReport Id: ${reportDetails.report.id}
          \nReport Type: ${reportDetails.report.reportType}
          \nDescription: ${reportDetails.report.description}
          \nProduct Id: ${reportDetails.report.productId}
          \n
          \nReport User:
          \nReporter Id: ${reportDetails.reportUser.id}
          \nReport user: ${reportDetails.reportUser.name}
          \nReport user email: ${reportDetails.reportUser.email}
          \nReport user status: ${reportDetails.reportUser.status}
          \nReport user number of reports: ${reportDetails.reportUser.numberOfReports}
          \nReport user isBlocked: ${reportDetails.reportUser.isBlocked}
          \nReport user isBlockedChat: ${reportDetails.reportUser.isBlockedChat}
          \nReport user isBlockedPost: ${reportDetails.reportUser.isBlockedPost}
          \n
          \nReported user:
          \nResult: ${reportDetails.reportedUser.status}
          \nReported User Id: ${reportDetails.reportedUser.id}
          \nReported user Number of Reports: ${reportDetails.reportedUser.numberOfReports}
          \nReported user Email: ${reportDetails.reportedUser.email}
          \nReported Name: ${reportDetails.reportedUser.name}
          \nReported user isBlocked: ${reportDetails.reportedUser.isBlocked}
          \nReported user isBlockedChat: ${reportDetails.reportedUser.isBlockedChat}
          \nReported user isBlockedPost: ${reportDetails.reportedUser.isBlockedPost}
        `,
      },
    });
  } catch (error) {
    console.error('Error sending email report: ', error);
  }
};