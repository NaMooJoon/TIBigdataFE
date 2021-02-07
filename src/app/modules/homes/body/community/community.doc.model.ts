export interface CommunityDocModel {
    docId?: number,
    userName?: string,
    userEmail?: string,
    title?: string,
    content?: string,
    regDate?: Date | string,
    modDate?: Date | string,
    isMainAnnounce?: Boolean,
    category?: string,
    reply?: {
        userName?: string,
        userEmail?: string,
        title?: string,
        content?: string,
        regDate?: Date | string,
        modDate?: Date | string,
    }
}