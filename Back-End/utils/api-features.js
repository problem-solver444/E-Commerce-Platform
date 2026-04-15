class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludeFields.forEach((field) => delete queryObj[field]);

    // advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const showFields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(showFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }
  search(modelName) {
    if (this.queryString.keyword) {
      let search = {};
      if (modelName == 'products') {
        search.$or = [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ];
      } else {
        search = { name: { $regex: this.queryString.keyword, $options: 'i' } };
      }
      this.mongooseQuery = this.mongooseQuery.find(search);
    }
    return this;
  }

  paginate(countDoucments) {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;
    const lastIndex = limit * page;
    const paginateResults = {};
    paginateResults.currentPage = page;
    paginateResults.limit = limit;
    paginateResults.numberOfPages = Math.ceil(countDoucments / limit);

    if (lastIndex < countDoucments) {
      paginateResults.next = page + 1;
    }
    if (skip > 0) {
      paginateResults.previous = page - 1;
    }
    this.paginateResult = paginateResults;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
  populate() {
    this.mongooseQuery = this.mongooseQuery.populate({
      path: 'category',
      select: 'name -_id',
    });
    return this;
  }
}

module.exports = ApiFeatures;
