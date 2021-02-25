export class Article {
  post_date: Date;
  post_title: string;
  post_writer: string;
  number: string;
  published_institutio: string;
  published_institution_url: string;
  post_body: string;
  file_download_url: string;
  original_url: string;
}

export interface ArticleSource {
  source: Article;
}
