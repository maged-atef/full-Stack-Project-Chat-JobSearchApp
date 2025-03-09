import User from "../../../db/models/user.model.js"
import Company from "../../../db/models/company.model.js"

export const finduser_GraphQL = async () => {
    const data = await User.find({});
    return {
        Data: data,
        statusCode: 200,
        success: true
    }
}

export const findcompany_GraphQL = async () => {
    const data = await Company.find({});
    return {
        Data: data,
        statusCode: 200,
        success: true
    }
}

export const CompanyBanned= async (_, approve, id) => {
    console.log(approve, id)
    const company = await Company.findOne({ _id: id })
    if (!company) return {
        Data: "company not found ",
        statusCode: 400,
        success: false

    }

    if (approve) {
        const now = new Date();
        company.bannedAt = now
       await company.save()
        return {
            Data: 'company banned successfully',
            statusCode: 200,
            success: true
        }
    } else {
        company.bannedAt = null
        company.save()
        return {
            Data: 'company unbanned successfully',
            statusCode: 200,
            success: true
        }
    }
}

export const CompanyApproval= async (_, approve, id) => {
    console.log(approve, id)
    const company = await Company.findOne({ _id: id })
    if (!company) return {
        Data: "company not found ",
        statusCode: 400,
        success: false

    }

    if (approve) {
        
        company.approvedByAdmin = approve
       await company.save()
        return {
            Data: 'company Confirmed by admin successfully',
            statusCode: 200,
            success: true
        }
    } else {
        company.approvedByAdmin = approve
        company.save()
        return {
            Data: 'company unConfirmed by admin successfully',
            statusCode: 200,
            success: true
        }
    }
}
export const userBanned = async (_, approve, id) => {
    console.log(approve, id)
    const user = await User.findOne({ _id: id }).select("bannedAt")
    if (!user) return {
        Data: "user not found ",
        statusCode: 400,
        success: false

    }

    if (approve) {
        const now = new Date();
        user.bannedAt = now
        await user.save()
        return {
            Data: 'user banned successfully',
            statusCode: 200,
            success: true
        }
    } else {
        user.bannedAt = null
        await user.save()

        return {
            Data: 'user unbanned successfully',
            statusCode: 200,
            success: true
        }
    }
}