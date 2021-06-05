class apiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // 1A) Filter
    Filter() {
        // 1A) Normal filter
        const queryObj = { ...this.queryStr };
        const excludeQuery = ["sort", "page", "limit", "fields"];

        excludeQuery.forEach((el) => delete queryObj[el]);

        // 1B) Advance filter
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|le)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr)).populate('freight');
        return this;
    }

    // 2) Sorting
    Sorting() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    // 3) Limiting  @Limitin by Fields name
    Limiting() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    // 4) Pagination
    Pagination() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 20;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

}

export default apiFeature;
