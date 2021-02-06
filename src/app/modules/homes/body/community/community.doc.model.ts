export interface CommunityDocModel {
    docId?: number,
    userName: String,
    userEmail: String,
    title?: String,
    content?: String,
    regDate?: Date | string,
    modDate?: Date | string,
    isMainAnnounce?: Boolean,
    category?: String
}