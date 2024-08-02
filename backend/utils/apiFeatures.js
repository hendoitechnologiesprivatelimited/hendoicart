class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        let keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: 'i'
                  }
              }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // Exclude fields from query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryCopy[field]);

        // Advanced filtering
        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(
            /\b(gte|gt|lt|lte)\b/g,
            match => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }


    paginate(resPerPage){

        const currentPage = Number (this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;
