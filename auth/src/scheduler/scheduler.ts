import * as corn from 'node-cron'

export type IScheduler = {
	success: boolean
	error?: Error
}

export abstract class Scheduler {
	private scheduleTime: string

	private task?: corn.ScheduledTask

	private options: corn.ScheduleOptions = {
		scheduled: true,
		timezone: 'America/New_York',
	}

	constructor(timeToExecute: string) {
		this.scheduleTime = timeToExecute

		this.initiateScheduler()
	}

	private initiateScheduler() {
		const isJobValidated = corn.validate(this.scheduleTime)
		if (isJobValidated) {
			this.task = corn.schedule(this.scheduleTime, this.taskInitializer, this.options)
			this.task.start()
		} else {
			throw Error(`Invalid cron schedule time: ${this.scheduleTime}`)
		}
	}

	taskInitializer = async () => {
		const job: IScheduler = await this.executeJob()
		if (job.success) {
			console.log('Job Successfully executed')
		} else {
			job.error = new Error('Error to execute the scheduled job')
		}
	}
	protected abstract executeJob(): Promise<IScheduler>
}
