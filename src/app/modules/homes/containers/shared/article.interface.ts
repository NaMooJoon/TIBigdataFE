export interface Article {
    post_date: Date,
    post_title: string,
    post_writer: string,
    number: string,
    published_institution_url: string,
    post_body: string
}

export interface ArticleSource {
    source: Article
}