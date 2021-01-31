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

    private _allDocs = {
        query: {
            match_all: {}
        }
    };

    public getAllDocs() {
        return this._allDocs;
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

    public getSearchIds(ids: string | string[]) {
        if (typeof (ids) === 'string') {
            this.ids = [];
            this.ids.push(ids);
        }
        else this.ids = ids;

        return {
            query: {
                ids: {
                    values: this.ids
                }
            }
        };
    }

    public setSearchKeyword(keyword: string) {
        console.log(keyword);
        this.searchKeyword = keyword;
        console.log(this.searchKeyword);
    }
}