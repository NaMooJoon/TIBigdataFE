export interface CommunityDocModel {
    docId?: Number,
    userName: String,
    userEmail: String,
    title?: String,
    content?: String,
    regDate?: Date | string,
    modDate?: Date | string,
    isMainAnnounce?: Boolean,
    category?: String
}