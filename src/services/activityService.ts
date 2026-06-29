import { ActivityLog, ActivityAction } from '../types';

let activityLogsData: ActivityLog[] = [];

export function getActivityLogs(): Promise<ActivityLog[]> {
  return Promise.resolve([...activityLogsData]);
}

export function getActivityLogsByUser(userId: string): Promise<ActivityLog[]> {
  return Promise.resolve(activityLogsData.filter(log => log.userId === userId));
}

export function createActivityLog(userId: string | null, action: ActivityAction, description: string): Promise<ActivityLog> {
  const log: ActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    action,
    description,
    createdAt: new Date(),
  };
  activityLogsData = [log, ...activityLogsData];
  return Promise.resolve(log);
}
