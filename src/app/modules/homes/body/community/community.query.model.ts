export interface CommunityQueryModel {
    docId?: Number,
    userName: String,
    userEmail: String,
    title?: String,
    content?: String,
    regDate?: Date,
    modDate?: Date,
    isMainAnnounce?: Boolean,
    category?: String
}