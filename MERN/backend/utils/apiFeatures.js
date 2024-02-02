// THIS us used to search the products , here (querry, querrystr)
// querry from Product & querrystr from (req) => to buy key=
class APIFeatures {
  // search => products
  constructor(querry, querrystr) {
    this.querry = querry;
    this.querrystr = querrystr;
  }
  search() {
    let keyword = this.querrystr.keyword
      ? {
          name: {
            // regex is used to seach the typing similar word
            $regex: this.querrystr.keyword,
            $options: "i",
          },
        }
      : {};
    this.querry.find({ ...keyword });
    return this;
  }

  // filter => categories
  filter() {
    const querystgcopy = { ...this.querrystr };
    // removing fields from query
    const removefields = ["keyword", "limit", "page"];

    removefields.forEach((field) => delete querystgcopy[field]);

    let querystr = JSON.stringify(querystgcopy);

    // let querystr = replace(/\b(gt|gte|lt|lte)/g, (match) => `$${match}`);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)/g, (match) => `$${match}`);
    // console.log(querystr);

    this.querry.find(JSON.parse(querystr));
    return this;
  }
  // paginate => is used to show the no of product at the page
  paginate(resultperpage) {
    const currentpage = Number(this.querrystr.page) || 1;
    const skip = resultperpage * (currentpage - 1);
    this.querry.limit(resultperpage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
