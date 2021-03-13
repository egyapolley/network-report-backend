const express = require("express");

const router = express.Router();
const User = require("../models/users");
const validate = require("../validators");
const auth = require("../middlewares/auth");

const db = require("../mysql-db/dbcon");

const mme_Counters = {
    NbrSuccessAttachRequests: "Number Of Success Attach Requests",
    AttAttachRequests: "VS_UE_attach_req",
    NbrAttachReqAbortBefore: "VS_UE_attach_abort_BeforeAttachCmp",
    NbrAttachReqAbortAfter: "VS_UE_attach_abort_AfterAttachCmp",
    NbrFailedAttachRequests_PLMNnotAllowed: "VS_UE_attach_fail_rej_PLMNnotAllowed",
    NbrFailedAttachRequests_EPSandNonEPSnotAllowed: "VS_UE_attach_fail_rej_EPSandNonEPSnotAllowed",
    NbrFailedAttachRequests_CannotDeriveUEid: "VS_UE_attach_fail_rej_UEidCannotBeDerived",
    NbrFailedAttachRequests_NetworkFailure: "VS_UE_attach_fail_rej_NetworkFailure",
    NbrPageRespInLastSeenTA: "VS_paging_all_rsp_ENBinLastTA",
    NbrPageRespNotInLastSeenTA: "VS_paging_all_rsp_ENBNotinLastTA",
    NbrPagingFailures_Timeout: "VS_paging_all_fail_OnMaxRetry",
    AttPaging_FirstAttempt: "VS_paging_all_req_1stTry",
    NbrSuccessTAU: "VS_UE_TAU_all_succ",
    TauInterMmeSucc: "VS_UE_TAU_IrMME_all_succ",
    AttTAU: "VS_UE_TAU_all_req",
    TauInterMmeAtt: "VS_UE_TAU_IrMME_all_req",
    VS_UE_attach_succ_rate_SFL: "VS_UE_attach_succ_rate_SFL",
    VS_paging_all_rsp_rate_copy_1: "VS_paging_all_rsp_rate_copy_1",
    VS_paging_all_rsp: "VS_paging_all_rsp",
    VS_UE_TAU_IaMME_all_succ_rate: "VS_UE_TAU_IaMME_all_succ_rate",
    VS_UE_TAU_IaMME_all_succ: "VS_UE_TAU_IaMME_all_succ",
    VS_UE_TAU_IaMME_all_req: "VS_UE_TAU_IaMME_all_req",
    UECapacityUsage:"MAF Capacity",
    AveNumOfDefaultBearers:"Avg Number_Default_Bearers",
    MaxNumOfDefaultBearers:"Max Number_Default_Bearers",
    AveNumOfDedicatedBearers:"Avg Number_Dedicated_Bearers",
    MaxNumOfDedicatedBearers:"Max Number_Dedicated_Bearers",
    AveNbrOfRegisteredUE:"Avg Number_Registered_UEs",
    MaxNbrOfRegisteredUE:"Max Number_Registered_UEs",
    AveNbrOfIdleUE:"Max Number_Idle_UEs",
    MaxNbrOfIdleUE:"Avg Number_Idle_UEs",
    AveConnectedUE:"Max Number_Connected_UEs",
    MaxConnectedUE:"Avg Number_Connected_UEs"
};
const mme_FormulaReport = ["VS_UE_attach_succ_rate_SFL", "VS_paging_all_rsp_rate_copy_1", "VS_paging_all_rsp",
        "VS_UE_TAU_IaMME_all_succ_rate", "VS_UE_TAU_IaMME_all_succ", "VS_UE_TAU_IaMME_all_req"];

const pgw_Counters = {
    NbrSuccessAttachRequests: "Number Of Success Attach Requests",
    AttAttachRequests: "VS_UE_attach_req",
    NbrAttachReqAbortBefore: "VS_UE_attach_abort_BeforeAttachCmp",
    NbrAttachReqAbortAfter: "VS_UE_attach_abort_AfterAttachCmp",
    NbrFailedAttachRequests_PLMNnotAllowed: "VS_UE_attach_fail_rej_PLMNnotAllowed",
    NbrFailedAttachRequests_EPSandNonEPSnotAllowed: "VS_UE_attach_fail_rej_EPSandNonEPSnotAllowed",
    NbrFailedAttachRequests_CannotDeriveUEid: "VS_UE_attach_fail_rej_UEidCannotBeDerived",
    NbrFailedAttachRequests_NetworkFailure: "VS_UE_attach_fail_rej_NetworkFailure",
    NbrPageRespInLastSeenTA: "VS_paging_all_rsp_ENBinLastTA",
    NbrPageRespNotInLastSeenTA: "VS_paging_all_rsp_ENBNotinLastTA",
    NbrPagingFailures_Timeout: "VS_paging_all_fail_OnMaxRetry",
    AttPaging_FirstAttempt: "VS_paging_all_req_1stTry",
    NbrSuccessTAU: "VS_UE_TAU_all_succ",
    TauInterMmeSucc: "VS_UE_TAU_IrMME_all_succ",
    AttTAU: "VS_UE_TAU_all_req",
    TauInterMmeAtt: "VS_UE_TAU_IrMME_all_req",
    VS_UE_attach_succ_rate_SFL: "VS_UE_attach_succ_rate_SFL",
    VS_paging_all_rsp_rate_copy_1: "VS_paging_all_rsp_rate_copy_1",
    VS_paging_all_rsp: "VS_paging_all_rsp",
    VS_UE_TAU_IaMME_all_succ_rate: "VS_UE_TAU_IaMME_all_succ_rate",
    VS_UE_TAU_IaMME_all_succ: "VS_UE_TAU_IaMME_all_succ",
    VS_UE_TAU_IaMME_all_req: "VS_UE_TAU_IaMME_all_req",
    UECapacityUsage:"MAF Capacity",
    AveNumOfDefaultBearers:"Avg Number_Default_Bearers",
    MaxNumOfDefaultBearers:"Max Number_Default_Bearers",
    AveNumOfDedicatedBearers:"Avg Number_Dedicated_Bearers",
    MaxNumOfDedicatedBearers:"Max Number_Dedicated_Bearers",
    AveNbrOfRegisteredUE:"Avg Number_Registered_UEs",
    MaxNbrOfRegisteredUE:"Max Number_Registered_UEs",
    AveNbrOfIdleUE:"Max Number_Idle_UEs",
    MaxNbrOfIdleUE:"Avg Number_Idle_UEs",
    AveConnectedUE:"Max Number_Connected_UEs",
    MaxConnectedUE:"Avg Number_Connected_UEs"
};
const pgw_FormulaReport = ["VS_UE_attach_succ_rate_SFL", "VS_paging_all_rsp_rate_copy_1", "VS_paging_all_rsp",
    "VS_UE_TAU_IaMME_all_succ_rate", "VS_UE_TAU_IaMME_all_succ", "VS_UE_TAU_IaMME_all_req"];




const sessions = {};

router.post("/users", async (req, res) => {
    const {error} = validate.UserRegister(req.body)
    if (error) return res.status(400).send(error.message);
    const {username, password} = req.body;

    try {
        let user = new User({username, password})
        user = await user.save();
        const token = user.generateAuthToken();
        res.send(token)
    } catch (ex) {
        console.log(ex)
        res.status(400).send(`${username} already registered`)
    }

})

router.post("/login", async (req, res) => {
    const {error} = validate.UserRegister(req.body)
    if (error) return res.status(400).send(error.message);
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user) return res.status(400).send(`Username "${username}" does not exist`);
    user.comparePassword(password, function (error, isMatch) {
        if (isMatch) {
            const token = user.generateAuthToken();
            res.send(token)
        } else {
            res.status(400).send(`Password is not valid`);
        }


    })


})
router.get("/data", auth, async (req, res) => {

    const {error} = validate.validateRequest(req.query);
    if (error) return res.status(400).send(error.message);

    const {node, period, reportCounter, startDate, endDate} = req.query
    await getData(node, period, reportCounter, startDate, endDate, req, res)

})


async function getData(node, period, reportCounter, startDate, endDate, req, res) {


    const query = generateQueryString(node, period, reportCounter);
    try {
        const [rows] = await db.query(query, [startDate, endDate])
        const data = rows.map(item => {
            item.date = formatReportDate(item.date)
            item.value =parseFloat(item.value)
            return item
        })
        const reportName = generateReportName(period, reportCounter)
        sessions[req.user.uid] = {reportName, data}
        return res.json({reportName, data})
    } catch (ex) {
        console.log(ex);
        res.status(404).send("Data not found. Please reporting parameters or call sysAdmin")
    }

}

function generateReportName(period, reportCounter,node) {
    let reportName = node ==="pgw"?pgw_Counters[reportCounter]:mme_Counters[reportCounter]
    return `${reportName}-${period.charAt(0).toUpperCase() + period.substring(1)}`

}

function formatReportDate(date) {
    return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}:${date.substring(8)}`.replace(/[:\\/-]*$/, "").trim()
}

function generateQueryString(node, period, reportCounter) {
    const tableName = "mme2_KPI." + reportCounter;
    let query = "";
    switch (period) {
        case "15mins":
            query = `select   date_format(timeInserted,'%Y%m%d%H%i%s') as date, (counterValue_1 + counterValue_2) as value from ${tableName} where timeInserted between ? and ?`;
            break;
        case "hourly":
            query = `select date_format( timeInserted, '%Y%m%d%H' ) as date, sum(counterValue_1 + counterValue_2) as value from ${tableName} where timeInserted between ? and ? group by date `;
            break;
        case "daily":
            query = `select date_format( timeInserted, '%Y%m%d' ) as date, sum(counterValue_1 + counterValue_2) as value from ${tableName} where timeInserted between ? and ? group by date `;
            break;
        case "weekly":
            query = `select date_format( timeInserted, '%x%v' ) as date, sum(counterValue_1 + counterValue_2) as value from ${tableName} where timeInserted between ? and ? group by date `;
            break;
        case "monthly":
            query = `select date_format( timeInserted, '%Y%m' ) as date, sum(counterValue_1 + counterValue_2) as value from ${tableName} where timeInserted between ? and ? group by date `;
            break;
        case "yearly":
            query = `select date_format( timeInserted, '%Y' ) as date, sum(counterValue_1 + counterValue_2) as value from ${tableName} where timeInserted between ? and ? group by date `;
            break;
        default:
            query = `select date_format( timeInserted, '%Y' ) as date, sum(counterValue_1 + counterValue_2) as value from ${tableName} where timeInserted between ? and ? group by date `;

    }

    return query;

}

module.exports = router;
