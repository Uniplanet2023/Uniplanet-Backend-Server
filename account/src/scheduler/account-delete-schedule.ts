import { IScheduler, Scheduler } from '@uniplanet-lib/common';
import Account from '../models/account';
import { deleteFilesByPrefix } from '../../config/firease-delete-files';

class UserDeleteScheduler extends Scheduler {
  constructor() {
    // Schedule the job to run every day at 4 AM
    super('00 00 04 * * *');
  }

  async executeJob(): Promise<IScheduler> {
    const now = new Date();
    console.log(`User Delete Scheduler running at ${now.toLocaleTimeString()}`);

    try {
      const accounts = await Account.find({ deletionDate: { $lte: now } });

      for (const account of accounts) {
        try {
          await this.deleteAccount(account);
        } catch (error) {
          console.error(`Error processing account ${account._id}:`, error);
        }
      }

      console.log('User Delete Scheduler completed successfully');
      return { success: true };
    } catch (err) {
      console.error('Error during User Delete Scheduler execution:', err);
      return { success: false };
    }
  }

  private async deleteAccount(account: any): Promise<void> {
    try {
      await Account.deleteOne({ _id: account._id });
      console.log(`Deleted account ${account._id}`);

      const prefix = `profile-image/${account.school}/${account._id}/`;
      await deleteFilesByPrefix(prefix);
      console.log(`Deleted files for account ${account._id}`);
    } catch (error) {
      console.error(`Error deleting files for account ${account._id}:`, error);
    }
  }
}

export default UserDeleteScheduler;