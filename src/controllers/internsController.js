const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const collageModel = require('../models/collageModel')
const internsModel = require('../models/internsModel')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createinterns = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide internship details' })
            return
        }

        // Extract params
        const { name, email, mobile} = requestBody;

        // Validation starts
        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'name is required' })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!isValid(mobile)) {
            res.status(400).send({ status: false, message: 'mobile number is required' })
            return
        }

        // // if (!isValid(collegeId)) {
        // //     res.status(400).send({ status: false, message: 'collage id is required' })
        // //     return
        // }

        // if (!isValidObjectId(collegeId)) {
        //     res.status(400).send({ status: false, message: `${collegeId} is not a valid collage id` })
        //     return
        // }
        // const collage = await collageModel.findById(collegeId);

        // if (!collage) {
        //     res.status(400).send({ status: false, message: `collage does not exit` })
        //     return
        // }
        const isEmailAlreadyUsed = await internsModel.findOne({ email }); // {email: email} object shorthand property

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }
        // Validation ends

        const internsData = { name, email, mobile}

        const newInternship = await internsModel.create(internsData)
        res.status(201).send({ status: true, message: 'New Internship registered successfully', data: newInternship })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}

// const listBlog = async function (req, res) {
//     try {
//         const filterQuery = {isDeleted: false, deletedAt: null, isPublished: true}
//         const queryParams = req.query

//         if(isValidRequestBody(queryParams)) {
//             const {authorId, category, tags, subcategory} = queryParams

//             if(isValid(authorId) && isValidObjectId(authorId)) {
//                 filterQuery['authorId'] = authorId
//             }

//             if(isValid(category)) {
//                 filterQuery['category'] = category.trim()
//             }

//             if(isValid(tags)) {
//                 const tagsArr = tags.trim().split(',').map(tag => tag.trim());
//                 filterQuery['tags'] = {$all: tagsArr}
//             }

//             if(isValid(subcategory)) {
//                 const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
//                 filterQuery['subcategory'] = {$all: subcatArr}
//             }
//         }

//         const blogs = await blogModel.find(filterQuery)

//         if(Array.isArray(blogs) && blogs.length===0) {
//             res.status(404).send({status: false, message: 'No blogs found'})
//             return
//         }

//         res.status(200).send({status: true, message: 'Blogs list', data: blogs})
//     } catch (error) {
//         res.status(500).send({status: false, message: error.message});
//     }
// }

// const updateBlog = async function (req, res) {
//     try {
//         const requestBody = req.body
//         const params = req.params
//         const blogId = params.blogId
//         const authorIdFromToken = req.authorId

//         // Validation stats
//         if(!isValidObjectId(blogId)) {
//             res.status(400).send({status: false, message: `${blogId} is not a valid blog id`})
//             return
//         }

//         if(!isValidObjectId(authorIdFromToken)) {
//             res.status(400).send({status: false, message: `${authorIdFromToken} is not a valid token id`})
//             return
//         }

//         const blog = await blogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null })

//         if(!blog) {
//             res.status(404).send({status: false, message: `Blog not found`})
//             return
//         }

//         if(blog.authorId.toString() !== authorIdFromToken) {
//             res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
//             return
//         }

//         if(!isValidRequestBody(requestBody)) {
//             res.status(200).send({status: true, message: 'No paramateres passed. Blog unmodified', data: blog})
//             return
//         }

//         // Extract params
//         const {title, body, tags, category, subcategory, isPublished} = requestBody;

//         const updatedBlogData = {}

//         if(isValid(title)) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

//             updatedBlogData['$set']['title'] = title
//         }

//         if(isValid(body)) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

//             updatedBlogData['$set']['body'] = body
//         }

//         if(isValid(category)) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

//             updatedBlogData['$set']['category'] = category
//         }

//         if(isPublished !== undefined) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

//             updatedBlogData['$set']['isPublished'] = isPublished
//             updatedBlogData['$set']['publishedAt'] = isPublished ? new Date() : null
//         }

//         if(tags) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}

//             if(Array.isArray(tags)) {
//                 updatedBlogData['$addToSet']['tags'] = { $each: [...tags]}
//             }
//             if(typeof tags === "string") {
//                 updatedBlogData['$addToSet']['tags'] = tags
//             }
//         }

//         if(subcategory) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}
//             if(Array.isArray(subcategory)) {
//                 updatedBlogData['$addToSet']['subcategory'] = { $each: [...subcategory]}
//             }
//             if(typeof subcategory === "string") {
//                 updatedBlogData['$addToSet']['subcategory'] = subcategory
//             }
//         }

//         const updatedBlog = await blogModel.findOneAndUpdate({_id: blogId}, updatedBlogData, {new: true})

//         res.status(200).send({status: true, message: 'Blog updated successfully', data: updatedBlog});
//     } catch (error) {
//         res.status(500).send({status: false, message: error.message});
//     }
// }

// const deleteBlogByID = async function (req, res) {
//     try {
//         const params = req.params
//         const blogId = params.blogId
//         const authorIdFromToken = req.authorId

//         if(!isValidObjectId(blogId)) {
//             res.status(400).send({status: false, message: `${blogId} is not a valid blog id`})
//             return
//         }

//         if(!isValidObjectId(authorIdFromToken)) {
//             res.status(400).send({status: false, message: `${authorIdFromToken} is not a valid token id`})
//             return
//         }

//         const blog = await blogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null })

//         if(!blog) {
//             res.status(404).send({status: false, message: `Blog not found`})
//             return
//         }

//         if(blog.authorId.toString() !== authorIdFromToken) {
//             res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
//             return
//         }

//         await blogModel.findOneAndUpdate({_id: blogId}, {$set: {isDeleted: true, deletedAt: new Date()}})
//         res.status(200).send({status: true, message: `Blog deleted successfully`})
//     } catch (error) {
//         res.status(500).send({status: false, message: error.message});
//     }
// }

// const deleteBlogByParams = async function (req, res) {
//     try {
//         const filterQuery = {isDeleted: false, deletedAt: null}
//         const queryParams = req.query
//         const authorIdFromToken = req.authorId

//         if(!isValidObjectId(authorIdFromToken)) {
//             res.status(400).send({status: false, message: `${authorIdFromToken} is not a valid token id`})
//             return
//         }

//         if(!isValidRequestBody(queryParams)) {
//             res.status(400).send({status: false, message: `No query params received. Aborting delete operation`})
//             return
//         }

//         const {authorId, category, tags, subcategory, isPublished} = queryParams

//         if(isValid(authorId) && isValidObjectId(authorId)) {
//             filterQuery['authorId'] = authorId
//         }

//         if(isValid(category)) {
//             filterQuery['category'] = category.trim()
//         }

//         if(isValid(isPublished)) {
//             filterQuery['isPublished'] = isPublished
//         }

//         if(isValid(tags)) {
//             const tagsArr = tags.trim().split(',').map(tag => tag.trim());
//             filterQuery['tags'] = {$all: tagsArr}
//         }

//         if(isValid(subcategory)) {
//             const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
//             filterQuery['subcategory'] = {$all: subcatArr}
//         }

//         const blogs = await blogModel.find(filterQuery);

//         if(Array.isArray(blogs) && blogs.length===0) {
//             res.status(404).send({status: false, message: 'No matching blogs found'})
//             return
//         }

//         const idsOfBlogsToDelete = blogs.map(blog => {
//             if(blog.authorId.toString() === authorIdFromToken) return blog._id
//         })

//         if(idsOfBlogsToDelete.length === 0) {
//             res.status(404).send({status: false, message: 'No blogs found'})
//             return
//         }

//         await blogModel.updateMany({_id: {$in: idsOfBlogsToDelete}}, {$set: {isDeleted: true, deletedAt: new Date()}})

//         res.status(200).send({status: true, message: 'Blog(s) deleted successfully'});
//     } catch (error) {
//         res.status(500).send({status: false, message: error.message});
//     }
// }

module.exports = { createinterns }
//     listBlog,
//     updateBlog,
//     deleteBlogByID,
//     deleteBlogByParams
// }
