export class ElasticSearchQueryModel {

    private ids: string[] = [];
    private searchKeyword: string = "";
    private searchSource = [
        "post_title",
        "post_date",
        "published_institution_url",
        "published_institution",
        "original_url",
        "post_writer",
        "post_body",
        "file_download_url",
    ];
    private searchField: string[] = ["post_title", "file_extracted_content", "post_body"];
    private filterPath: string[] = [
        "hits.hits._source",
        "hits.hits._id",
        "hits.total",
        "_scroll_id"
    ]

    public getAllDocs() {
        return {
            "query": {
                "match_all": {}
            }
        }
    }

    public getSearchDocs() {
        return {
            query: {
                multi_match: {
                    query: this.searchKeyword,
                    fields: this.searchField,
                }
            }
        };
    }

    public getSearchSource() {
        return this.searchSource;
    }

    public getFilterPath() {
        return this.filterPath;
    }

    public getSearchIds() {
        return {
            query: {
                ids: {
                    values: this.ids
                }
            }
        };
    }

    public setSearchKeyword(keyword: string) {
        this.searchKeyword = keyword;
    }

    public setSearchIds(ids: string[]) {
        this.ids = ids;
    }
}