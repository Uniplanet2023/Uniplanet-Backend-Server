
export type GetAccountRestPayload = {
    id: string
    name: string
    email: string
    profileImage: string
    school: string
    unreadNotification: number
    unreadMessage: number
    searchHistory: string[]
    recentViewHistory: string[]
}