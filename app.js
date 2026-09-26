const appContent = document.getElementById("appContent");
const pageTitle = document.getElementById("pageTitle");
const sidebar = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");
const navItems = document.querySelectorAll(".nav-item");

const SUPABASE_URL = "https://zdevrwucxvocoftxcide.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_y6lclqJvtRbOAh-BspEixw_3NU-OEhJ";

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY

);


// =====================================
// C1PX COMPANY
// =====================================

let currentCompany = null;
let companyContacts = [];

async function loadCompany() {

    // Load company
    const { data, error } = await db
        .from("companies")
        .select("*")
        .eq("name", "JMD Property")
        .single();

    if (error) {
        console.error("Company loading error:", error);
        return;
    }

    currentCompany = data;

    // Show company name in CRM
    const companyName = document.getElementById("companyName");

    if (companyName && currentCompany.name) {
        companyName.textContent = currentCompany.name;
    }

    // Load company contacts
    const { data: contacts, error: contactsError } = await db
        .from("company_contacts")
        .select("*")
        .eq("company_id", currentCompany.id)
        .order("is_primary", { ascending: false });

    if (contactsError) {
        console.error("Company contacts loading error:", contactsError);
        companyContacts = [];
    } else {
        companyContacts = contacts || [];
    }

    console.log("C1PX Company Loaded:", currentCompany);
    await loadEmployees();
    console.log("C1PX Company Contacts:", companyContacts);
}

const employees = ["Swapnil", "Ganesh", "Rohit", "Harsh", "Priya"];

// =====================================================
// C1PX OWNER / ADMIN ACCESS HELPERS
// =====================================================
// The owner account is protected: its login email, password,
// Auth identity and employee record cannot be changed/deleted
// from the Employees module.
function isC1PXOwner(employee = window.currentEmployee) {
    return Boolean(
        employee?.is_owner === true ||
        employee?.is_protected === true ||
        String(employee?.role || "").toLowerCase() === "owner"
    );
}

function isC1PXAdminOrOwner(employee = window.currentEmployee) {
    const role = String(employee?.role || "").toLowerCase();
    return role === "admin" || role === "owner" || isC1PXOwner(employee);
}

// =====================================
// C1PX EMPLOYEES
// =====================================

let companyEmployees = [];

async function loadEmployees() {

    if (!currentCompany) {
        console.warn("Company not loaded yet.");
        return;
    }

    const { data, error } = await db
        .from("employees")
        .select("*")
        .eq("company_id", currentCompany.id)
        .eq("active", true)
        .order("id", { ascending: true });

    if (error) {
        console.error("Employee loading error:", error);
        return;
    }

    companyEmployees = data || [];

    console.log("C1PX Employees Loaded:", companyEmployees);
    if (typeof appContent !== "undefined" && appContent) {
    const activeEmployeePage = document.querySelector('[data-nav="employees"].active');

    if (activeEmployeePage) {
        appContent.innerHTML = employeesHTML();
    }
}
}

// Backward-compatible employee reload helper used by edit/delete/login controls.
window.loadCompanyEmployees = async function () {
    await loadEmployees();
};

const statuses = ["New","Contacted","Interested","Follow-up","Site Visit Planned","Site Visit Done","Negotiation","Booked","Lost"];
const projects = ["Dayal Dev Park","Guru Dev Park","Venkatesh Vihar"];
const sources = ["Instagram","Facebook Ads","WhatsApp","Website","Referral","Walk-in","Other"];
const types = ["Plot","1BHK","2BHK","Commercial"];

let leads = [
 {id:1,name:"Vijay Jadhav",phone:"+91 98220 44112",whatsapp:"+91 98220 44112",email:"vijay@example.com",location:"Solapur",project:"Dayal Dev Park",type:"Plot",budget:"₹20L – ₹30L",source:"Instagram",status:"Hot",assigned:"Rahul",followupDate:"2026-08-17",followupTime:"10:00",notes:"Looking for a 1000 sq.ft plot.",timeline:["Lead created","Instagram enquiry received","Customer contacted","Follow-up scheduled"]},
 {id:2,name:"Neha Patil",phone:"+91 97655 33124",whatsapp:"+91 97655 33124",email:"neha@example.com",location:"Solapur",project:"Guru Dev Park",type:"2BHK",budget:"₹20L – ₹30L",source:"Facebook Ads",status:"Interested",assigned:"Amit",followupDate:"2026-08-17",followupTime:"12:30",notes:"Wants 2BHK for family use.",timeline:["Lead created","Facebook lead received","Customer contacted"]},
 {id:3,name:"Sameer Shaikh",phone:"+91 96041 77881",whatsapp:"+91 96041 77881",email:"",location:"Solapur",project:"Venkatesh Vihar",type:"Plot",budget:"₹10L – ₹20L",source:"WhatsApp",status:"New",assigned:"Swapnil",followupDate:"2026-08-18",followupTime:"11:00",notes:"Asked for available plot sizes.",timeline:["Lead created","WhatsApp enquiry received"]},
 {id:4,name:"Rajesh Kumar",phone:"+91 98810 55221",whatsapp:"+91 98810 55221",email:"rajesh@example.com",location:"Pune",project:"Dayal Dev Park",type:"Plot",budget:"₹30L+",source:"Referral",status:"Site Visit Planned",assigned:"Rahul",followupDate:"2026-08-18",followupTime:"09:30",notes:"Family will visit the site.",timeline:["Lead created","Customer contacted","Site visit planned"]},
 {id:5,name:"Anjali Sharma",phone:"+91 98700 61234",whatsapp:"+91 98700 61234",email:"anjali@example.com",location:"Solapur",project:"Guru Dev Park",type:"1BHK",budget:"₹10L – ₹20L",source:"Instagram",status:"Follow-up",assigned:"Priya",followupDate:"2026-08-19",followupTime:"15:00",notes:"Comparing 1BHK options.",timeline:["Lead created","Instagram enquiry","Customer contacted","Follow-up scheduled"]},
 {id:6,name:"Prakash More",phone:"+91 97622 11445",whatsapp:"+91 97622 11445",email:"",location:"Akkalkot",project:"Venkatesh Vihar",type:"Plot",budget:"₹20L – ₹30L",source:"Walk-in",status:"Site Visit Done",assigned:"Amit",followupDate:"2026-08-20",followupTime:"11:30",notes:"Visited site. Interested in corner plot.",timeline:["Lead created","Walk-in enquiry","Site visit completed"]},
 {id:7,name:"Sneha Patil",phone:"+91 90110 88991",whatsapp:"+91 90110 88991",email:"sneha@example.com",location:"Solapur",project:"Venkatesh Vihar",type:"Commercial",budget:"₹30L+",source:"Website",status:"Negotiation",assigned:"Swapnil",followupDate:"2026-08-21",followupTime:"16:00",notes:"Discussing commercial property pricing.",timeline:["Lead created","Website enquiry","Customer contacted","Negotiation started"]},
 {id:8,name:"Aakash Kulkarni",phone:"+91 98230 11987",whatsapp:"+91 98230 11987",email:"aakash@example.com",location:"Solapur",project:"Dayal Dev Park",type:"Plot",budget:"₹20L – ₹30L",source:"Facebook Ads",status:"Booked",assigned:"Rahul",followupDate:"",followupTime:"",notes:"Booking confirmed.",timeline:["Lead created","Facebook lead","Site visit completed","Negotiation","Booked"]}
];

// =====================================================
// C1PX - LOAD LEADS FROM SUPABASE
// =====================================================

async function loadLeads() {

    if (!currentCompany) {
        await loadCompany();
    }

    if (!currentCompany) {
        console.error("❌ Cannot load leads: company not loaded.");
        return;
    }

    const { data, error } = await db
        .from("leads")
        .select("*")
        .eq("company_id", currentCompany.id)
        .order("created_at", {
            ascending: false
        });

    if (error) {
        console.error(
            "❌ Supabase leads loading error:",
            error
        );
        return;
    }

    if (!data) {
        console.warn("⚠️ No leads returned from Supabase.");
        return;
    }

    // -----------------------------------------------------
    // C1PX - SAFE EXISTING-LEAD DEDUPLICATION
    // -----------------------------------------------------
    // Older imports may already have created duplicate rows in
    // Supabase. The dashboard must not count those duplicates.
    // We keep the newest row because the query is ordered by
    // created_at descending.
    const normalizeLeadPhone = value => {
        const digits = String(value ?? "").replace(/\\D/g, "");
        return digits.length > 10 ? digits.slice(-10) : digits;
    };

    const normalizeLeadEmail = value =>
        String(value ?? "").trim().toLowerCase();

    const normalizeLeadMetaId = value =>
        String(value ?? "").trim();

    const uniqueLeads = [];
    const seenMeta = new Set();
    const seenPhone = new Set();
    const seenEmail = new Set();

    for (const lead of data) {
        const metaKey = normalizeLeadMetaId(lead.external_lead_id);
        const phoneKey = normalizeLeadPhone(lead.phone);
        const emailKey = normalizeLeadEmail(lead.email);

        const duplicate =
            (metaKey && seenMeta.has(metaKey)) ||
            (phoneKey && seenPhone.has(phoneKey)) ||
            (emailKey && seenEmail.has(emailKey));

        if (duplicate) continue;

        uniqueLeads.push(lead);
        if (metaKey) seenMeta.add(metaKey);
        if (phoneKey) seenPhone.add(phoneKey);
        if (emailKey) seenEmail.add(emailKey);
    }

    leads = uniqueLeads;

    const duplicateCount = data.length - leads.length;

    console.log(
        "C1PX Leads Loaded From Supabase:",
        data.length,
        "database rows;",
        leads.length,
        "unique leads;",
        duplicateCount,
        "duplicates hidden from CRM count."
    );
}

// =====================================
// PLOT INVENTORY
// =====================================

let plotInventory = [
  {
    project: "Dayal Dev Park",
    phase: "Phase 1",
    totalPlots: 39,
    soldPlots: 0,
    availablePlots: 0,
    phaseStatus: "Coming Soon"
  },
  {
    project: "Dayal Dev Park",
    phase: "Phase 2",
    totalPlots: 37,
    soldPlots: 0,
    availablePlots: 0,
    phaseStatus: "Coming Soon"
  },
  {
    project: "Dayal Dev Park",
    phase: "Phase 3",
    totalPlots: 63,
    soldPlots: 54,
    availablePlots: 9,
    phaseStatus: "Selling Now"
  }
];

// =====================================================
// C1PX - MASTER PROPERTY PLOT SIZE DATA
// =====================================================

const propertyPlotSizes = {

    // =================================================
    // DAYAL DEV PARK - PHASE 1
    // =================================================

    "Dayal Dev Park|Phase 1": [
        [141.193, 1519],
        [110.458, 1189],
        [107.804, 1160],
        [105.150, 1131],
        [102.495, 1103],
        [103.261, 1111],
        [109.834, 1182],
        [93.797, 1009],
        [90.876, 978],
        [87.956, 946],
        [85.035, 915],
        [82.115, 884],
        [79.194, 852],
        [76.274, 821],
        [78.535, 845],
        [108.529, 1168],
        [101.250, 1089],
        [101.250, 1089],
        [101.250, 1089],
        [101.250, 1089],
        [101.250, 1089],
        [101.250, 1089],
        [101.250, 1089],
        [114.750, 1235],
        [118.125, 1271],
        [81.000, 872],
        [86.468, 930],
        [86.481, 931],
        [81.008, 872],
        [118.130, 1271],
        [114.736, 1235],
        [101.231, 1089],
        [101.225, 1089],
        [101.219, 1089],
        [101.213, 1089],
        [101.207, 1089],
        [101.201, 1089],
        [101.195, 1089],
        [108.445, 1167]
    ],


    // =================================================
    // DAYAL DEV PARK - PHASE 2
    // =================================================

    "Dayal Dev Park|Phase 2": [
        [130.015, 1399],
        [102.225, 1107],
        [102.225, 1107],
        [102.225, 1107],
        [102.225, 1107],
        [102.225, 1107],
        [102.225, 1107],
        [102.225, 1107],
        [119.850, 1290],
        [123.375, 1327],
        [103.429, 1113],
        [103.429, 1113],
        [103.429, 1113],
        [103.429, 1113],
        [103.429, 1113],
        [103.429, 1113],
        [123.375, 1327],
        [119.850, 1287],
        [102.225, 1100],
        [102.225, 1100],
        [102.225, 1100],
        [102.225, 1100],
        [102.225, 1100],
        [102.225, 1100],
        [102.225, 1100],
        [129.994, 1399],
        [147.359, 1586],
        [149.182, 1605],
        [153.704, 1654],
        [158.226, 1703],
        [162.747, 1751],
        [167.269, 1800],
        [150.619, 1621],
        [155.000, 1668],
        [211.631, 2277],
        [217.471, 2340],
        [240.433, 2587]
    ],


    // =================================================
    // DAYAL DEV PARK - PHASE 3
    // =================================================

    "Dayal Dev Park|Phase 3": [
        [125.10, 1346],
        [89.62, 964],
        [90.72, 976],
        [91.83, 988],
        [92.93, 1000],
        [94.03, 1012],
        [95.13, 1024],
        [96.23, 1035],
        [97.33, 1047],
        [98.35, 1058],
        [99.54, 1071],
        [132.88, 1430],
        [101.85, 1096],
        [93.23, 1003],
        [93.23, 1003],
        [93.23, 1003],
        [93.23, 1003],
        [93.23, 1003],
        [93.23, 1003],
        [123.39, 1328],
        [112.20, 1207],
        [85.12, 916],
        [85.12, 916],
        [85.05, 215],
        [85.12, 916],
        [85.12, 916],
        [85.13, 916],
        [85.13, 916],
        [85.13, 916],
        [85.13, 916],
        [85.13, 916],
        [124.28, 1337],
        [89.18, 960],
        [83.08, 894],
        [83.08, 894],
        [83.08, 894],
        [83.08, 894],
        [83.08, 894],
        [83.08, 894],
        [83.08, 894],
        [83.08, 894],
        [109.51, 1178],
        [109.80, 1181],
        [85.40, 919],
        [85.40, 919],
        [88.84, 956],
        [202.19, 2176],
        [213.78, 2300],
        [213.78, 2300],
        [245.72, 2644],
        [245.18, 2638],
        [245.18, 2638],
        [245.18, 2638],
        [245.18, 2638],
        [245.18, 2638],
        [200.38, 2156],
        [201.43, 2167],
        [201.72, 2171],
        [201.82, 2172],
        [201.43, 2167],
        [200.94, 2162],
        [202.01, 2174],
        [202.13, 2175]
    ],


    // =================================================
    // GURU DEV PARK
    // =================================================

    "Guru Dev Park|Phase 1": [
        [83.298, 896.62],
        [60.889, 655.41],
        [61.493, 661.91],
        [61.547, 662.49],
        [61.005, 656.66],
        [83.356, 897.24],
        [84.458, 909.11],
        [61.812, 665.34],
        [62.122, 668.68],
        [61.992, 667.28],
        [61.812, 665.34],
        [84.458, 909.11],
        [84.573, 910.35],
        [61.896, 666.25],
        [61.836, 665.60],
        [204.838, 2204.87],
        [200.064, 2153.48],
        [200.757, 2160.93],
        [202.354, 2178.11],
        [72.502, 780.41],
        [73.582, 792.03],
        [100.540, 1082.22],
        [227.279, 2446.41],
        [206.481, 2222.55],
        [105.130, 1131.62],
        [76.941, 828.18],
        [74.817, 805.33],
        [74.479, 801.69],
        [76.941, 828.18],
        [105.130, 1131.62],
        [105.130, 1131.62],
        [76.941, 828.18],
        [74.278, 799.53],
        [73.940, 795.89],
        [76.941, 828.18],
        [105.130, 1131.62],
        [105.130, 1131.62],
        [76.941, 828.18],
        [73.739, 793.72],
        [73.353, 789.57],
        [76.941, 828.18],
        [105.130, 1131.62],
        [105.130, 1131.62],
        [76.941, 828.18],
        [73.152, 787.40],
        [74.606, 803.05],
        [78.838, 848.61],
        [107.721, 1159.50],
        [107.721, 1159.50],
        [78.838, 848.61],
        [74.395, 800.79]
    ]

};

// =====================================
// DAYAL DEV PARK - PHASE 3 INDIVIDUAL PLOTS
// =====================================

let phase3Plots = [];

const phase3PlotSizes = [
    [125.10, 1346],
    [89.62, 964],
    [90.72, 976],
    [91.83, 988],
    [92.93, 1000],
    [94.03, 1012],
    [95.13, 1024],
    [96.23, 1035],
    [97.33, 1047],
    [98.35, 1058],
    [99.54, 1071],
    [132.88, 1430],
    [101.85, 1096],
    [93.23, 1003],
    [93.23, 1003],
    [93.23, 1003],
    [93.23, 1003],
    [93.23, 1003],
    [93.23, 1003],
    [123.39, 1328],
    [112.20, 1207],
    [85.12, 916],
    [85.12, 916],
    [85.05, 215],
    [85.12, 916],
    [85.12, 916],
    [85.13, 916],
    [85.13, 916],
    [85.13, 916],
    [85.13, 916],
    [85.13, 916],
    [124.28, 1337],
    [89.18, 960],
    [83.08, 894],
    [83.08, 894],
    [83.08, 894],
    [83.08, 894],
    [83.08, 894],
    [83.08, 894],
    [83.08, 894],
    [83.08, 894],
    [109.51, 1178],
    [109.80, 1181],
    [85.40, 919],
    [85.40, 919],
    [88.84, 956],
    [202.19, 2176],
    [213.78, 2300],
    [213.78, 2300],
    [245.72, 2644],
    [245.18, 2638],
    [245.18, 2638],
    [245.18, 2638],
    [245.18, 2638],
    [245.18, 2638],
    [200.38, 2156],
    [201.43, 2167],
    [201.72, 2171],
    [201.82, 2172],
    [201.43, 2167],
    [200.94, 2162],
    [202.01, 2174],
    [202.13, 2175]
];

// =====================================================
// GENERIC PLOT ARRAYS
// =====================================================
function createPlotsFromSizes(project, phase) {

    const key = `${project}|${phase}`;

    const sizes = propertyPlotSizes[key] || [];

    return sizes.map((size, index) => {

        return {

            plotNumber: index + 1,

            project: project,

            phase: phase,

            areaSqM: Number(size[0]),

            areaSqFt: Number(size[1]),

            status:
                project === "Dayal Dev Park" &&
                phase === "Phase 3" &&
                index < 54
                    ? "Sold"
                    : "Available",

            customerName: "",

            customerPhone: "",

            assignedEmployee: "",

            visitDate: "",

            holdUntil: "",

            followUpDate: "",

            notes: ""

        };

    });
}

let phase1Plots = createPlotsFromSizes(
    "Dayal Dev Park",
    "Phase 1"
);

let phase2Plots = createPlotsFromSizes(
    "Dayal Dev Park",
    "Phase 2"
);

let guruDevParkPhase1Plots = createPlotsFromSizes(
    "Guru Dev Park",
    "Phase 1"
);

for (let i = 1; i <= 63; i++) {

    const size = phase3PlotSizes[i - 1];

    phase3Plots.push({

        plotNumber: i,

        project: "Dayal Dev Park",

        phase: "Phase 3",

        areaSqM: size ? size[0] : 0,

        areaSqFt: size ? size[1] : 0,

        status: i <= 54 ? "Sold" : "Available",

        customerName: "",

        customerPhone: "",

        assignedEmployee: "",

        visitDate: "",

        holdUntil: "",

        followUpDate: "",

        notes: ""

    });
}

// =====================================================
// C1PX - GENERIC PROPERTY PLOT RESTORE SYSTEM
// =====================================================

const savedPropertyPlotData = JSON.parse(
    localStorage.getItem("c1pxPropertyPlotData") || "{}"
);


// -----------------------------------------------------
// RESTORE PLOT DATA
// -----------------------------------------------------

function restorePropertyPlotData(
    project,
    phase,
    plots
) {

    if (!Array.isArray(plots)) return;

    const key = `${project}|${phase}`;

    const savedPhase =
        savedPropertyPlotData[key] || {};

    plots.forEach(plot => {

        const saved =
            savedPhase[String(plot.plotNumber)];

        if (!saved) return;

        plot.status =
            saved.status ?? plot.status;

        plot.customerName =
            saved.customerName ?? "";

        plot.customerPhone =
            saved.customerPhone ?? "";

        plot.assignedEmployee =
            saved.assignedEmployee ?? "";

        plot.visitDate =
            saved.visitDate ?? "";

        plot.holdUntil =
            saved.holdUntil ?? "";

        plot.followUpDate =
            saved.followUpDate ?? "";

        plot.notes =
            saved.notes ?? "";
    });
}


// -----------------------------------------------------
// RESTORE ALL CURRENT PROJECTS / PHASES
// -----------------------------------------------------

restorePropertyPlotData(
    "Dayal Dev Park",
    "Phase 1",
    phase1Plots
);

restorePropertyPlotData(
    "Dayal Dev Park",
    "Phase 2",
    phase2Plots
);

restorePropertyPlotData(
    "Dayal Dev Park",
    "Phase 3",
    phase3Plots
);

restorePropertyPlotData(
    "Guru Dev Park",
    "Phase 1",
    guruDevParkPhase1Plots
);


// =====================================================
// C1PX - SUPABASE PROPERTY PLOT DATA LAYER
// Permanent storage for projects/phases/individual plots.
// LocalStorage remains only as a migration/fallback layer.
// =====================================================

function getPropertyPlotSources() {
    return [
        { project: "Dayal Dev Park", phase: "Phase 1", plots: phase1Plots },
        { project: "Dayal Dev Park", phase: "Phase 2", plots: phase2Plots },
        { project: "Dayal Dev Park", phase: "Phase 3", plots: phase3Plots },
        { project: "Guru Dev Park", phase: "Phase 1", plots: guruDevParkPhase1Plots }
    ];
}

function applySavedPlotFields(plot, saved) {
    if (!saved) return;

    plot.status = saved.status ?? plot.status;
    plot.customerName = saved.customer_name ?? saved.customerName ?? plot.customerName ?? "";
    plot.customerPhone = saved.customer_phone ?? saved.customerPhone ?? plot.customerPhone ?? "";
    plot.assignedEmployee = saved.assigned_employee ?? saved.assignedEmployee ?? plot.assignedEmployee ?? "";
    plot.visitDate = saved.visit_date ?? saved.visitDate ?? plot.visitDate ?? "";
    plot.holdUntil = saved.hold_until ?? saved.holdUntil ?? plot.holdUntil ?? "";
    plot.followUpDate = saved.follow_up_date ?? saved.followUpDate ?? plot.followUpDate ?? "";
    plot.notes = saved.notes ?? plot.notes ?? "";
}

function propertyPlotToRow(plot) {
    return {
        company_id: currentCompany.id,
        project_name: plot.project,
        phase_name: plot.phase,
        plot_number: Number(plot.plotNumber),
        area_sq_m: Number(plot.areaSqM ?? plot.sqM ?? 0),
        area_sq_ft: Number(plot.areaSqFt ?? plot.sqFt ?? 0),
        status: plot.status || "Available",
        customer_name: plot.customerName || null,
        customer_phone: plot.customerPhone || null,
        assigned_employee: plot.assignedEmployee || null,
        visit_date: plot.visitDate || null,
        hold_until: plot.holdUntil || null,
        follow_up_date: plot.followUpDate || null,
        notes: plot.notes || null,
        updated_at: new Date().toISOString()
    };
}

async function savePropertyPlotToSupabase(plot) {
    if (!currentCompany || !plot) return;

    const row = propertyPlotToRow(plot);

    const { data, error } = await db
        .from("property_plots")
        .upsert(row, {
            onConflict: "company_id,project_name,phase_name,plot_number"
        })
        .select()
        .single();

    if (error) {
        console.error("C1PX property plot Supabase save error:", error);
        throw error;
    }

    return data;
}

async function loadPropertyPlotsFromSupabase() {
    if (!currentCompany) return;

    const { data, error } = await db
        .from("property_plots")
        .select("*")
        .eq("company_id", currentCompany.id)
        .order("project_name", { ascending: true })
        .order("phase_name", { ascending: true })
        .order("plot_number", { ascending: true });

    if (error) {
        console.warn(
            "C1PX property_plots is not available yet. Run the supplied Supabase migration.",
            error.message
        );
        return false;
    }

    const existing = new Map(
        (data || []).map(row => [
            `${row.project_name}|${row.phase_name}|${row.plot_number}`,
            row
        ])
    );

    const rowsToCreate = [];

    for (const { project, phase, plots } of getPropertyPlotSources()) {
        for (const plot of plots) {
            const key = `${project}|${phase}|${plot.plotNumber}`;
            const saved = existing.get(key);

            if (saved) {
                plot.areaSqM = Number(saved.area_sq_m ?? plot.areaSqM ?? 0);
                plot.areaSqFt = Number(saved.area_sq_ft ?? plot.areaSqFt ?? 0);
                applySavedPlotFields(plot, saved);
            } else {
                // Migrate an existing generic browser save if present.
                const browserData = JSON.parse(
                    localStorage.getItem("c1pxPropertyPlotData") || "{}"
                );
                const browserSaved =
                    browserData[`${project}|${phase}`]?.[String(plot.plotNumber)];

                if (browserSaved) {
                    applySavedPlotFields(plot, browserSaved);
                }

                rowsToCreate.push(propertyPlotToRow(plot));
            }
        }
    }

    if (rowsToCreate.length) {
        const { error: seedError } = await db
            .from("property_plots")
            .upsert(rowsToCreate, {
                onConflict: "company_id,project_name,phase_name,plot_number",
                ignoreDuplicates: true
            });

        if (seedError) {
            console.error("C1PX property plot initial seed error:", seedError);
        }
    }

    return true;
}

// -----------------------------------------------------
// BACKWARD COMPATIBILITY
// Keep existing Phase 3 browser data available for migration.
// -----------------------------------------------------

const oldPhase3PlotData = JSON.parse(
    localStorage.getItem("phase3PlotData") || "{}"
);

const oldPhase3Statuses = JSON.parse(
    localStorage.getItem("phase3PlotStatuses") || "{}"
);

// Migrate legacy Phase 3 browser data into the generic local structure
// only when the generic record does not already exist.
const genericPropertyData = JSON.parse(
    localStorage.getItem("c1pxPropertyPlotData") || "{}"
);

if (!genericPropertyData["Dayal Dev Park|Phase 3"]) {
    genericPropertyData["Dayal Dev Park|Phase 3"] = {};
}

phase3Plots.forEach(plot => {
    const key = String(plot.plotNumber);

    if (genericPropertyData["Dayal Dev Park|Phase 3"][key]) return;

    const legacy = oldPhase3PlotData[key];
    const legacyStatus = oldPhase3Statuses[key];

    if (legacy || legacyStatus) {
        genericPropertyData["Dayal Dev Park|Phase 3"][key] = {
            status: legacy?.status ?? legacyStatus ?? plot.status,
            customerName: legacy?.customerName ?? "",
            customerPhone: legacy?.customerPhone ?? "",
            assignedEmployee: legacy?.assignedEmployee ?? "",
            visitDate: legacy?.visitDate ?? "",
            holdUntil: legacy?.holdUntil ?? "",
            followUpDate: legacy?.followUpDate ?? "",
            notes: legacy?.notes ?? ""
        };
    }
});

localStorage.setItem(
    "c1pxPropertyPlotData",
    JSON.stringify(genericPropertyData)
);

// =====================================
// PLOT STATUS COUNTERS
// =====================================

function getPhase3PlotCounts() {
    return {
        total: phase3Plots.length,
        sold: phase3Plots.filter(plot => plot.status === "Sold").length,
        available: phase3Plots.filter(plot => plot.status === "Available").length,
        hold: phase3Plots.filter(plot => plot.status === "On Hold").length,
        pipeline: phase3Plots.filter(plot => plot.status === "Pipeline").length,
        siteVisit: phase3Plots.filter(plot => plot.status === "Site Visit").length
    };
}

// ===============================
// BIRTHDAY WISH SYSTEM
// ===============================

// ================================
// BIRTHDAY WISH MESSAGE
// ================================
const birthdayMessage = (lead) => {
    const party = String.fromCodePoint(0x1F389);
    const cake = String.fromCodePoint(0x1F382);
    const celebration = String.fromCodePoint(0x1F973);
    const heart = String.fromCodePoint(0x2764, 0xFE0F);

    return `Hello ${lead.name}, ${party}

${currentCompany?.name || "JMD Group"} wishes you a very Happy Birthday!

May this new year of your life bring you happiness, success, good health and prosperity. ${heart}

Best wishes,
${currentCompany?.name || "JMD Group"}`;
};

function getTodayBirthdays() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return leads.filter(lead => {
        if (!lead.dob) return false;

        const dob = new Date(lead.dob);
        const dobMonth = String(dob.getMonth() + 1).padStart(2, "0");
        const dobDay = String(dob.getDate()).padStart(2, "0");

        return dobMonth === month && dobDay === day;
    });
}

function openBirthdayWhatsApp(id) {

    const lead = leads.find(x => x.id === id);

    if (!lead) {
        alert("Customer not found.");
        return;
    }

    const rawNumber = lead.whatsapp || lead.phone || "";

    if (!rawNumber) {
        alert("WhatsApp number is not available for this customer.");
        return;
    }

    let number = String(rawNumber).replace(/\D/g, "");

    // Add India country code
    if (number.length === 10) {
        number = "91" + number;
    }

    // Create birthday message
    const message = birthdayMessage(lead);

    // Encode message
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp
    window.open(
        `https://wa.me/${number}?text=${encodedMessage}`,
        "_blank"
    );
}

function checkBirthdayLeads() {
    const birthdays = getTodayBirthdays();

    if (birthdays.length === 0) {
        console.log("🎂 No birthdays today.");
        return;
    }

    console.log("🎂 Today's birthdays:", birthdays);

    birthdays.forEach(lead => {
        console.log(`🎉 Birthday today: ${lead.name}`);
    });
}

function statusClass(status){
  if(status === "Hot" || status === "Lost") return status === "Hot" ? "hot" : "danger";
  if(["Interested","Follow-up","Negotiation","Site Visit Planned"].includes(status)) return "warm";
  if(["Booked","Site Visit Done"].includes(status)) return "success";
  return "new";
}

function birthdaySettingsHTML() {
    const savedMessage = localStorage.getItem("birthdayMessage") || 
`Hello {name}, \u{1F389}

${currentCompany?.name || "JMD Group"} wishes you a very Happy Birthday! \u{1F382} \u{1F973}

May this new year of your life bring you happiness, success, good health and prosperity. \u{2764}\u{FE0F}

Best wishes,
${currentCompany?.name || "JMD Group"}`

    return `
    <section class="panel">
        <div class="panel-header">
            <div>
                <h4>🎂 Birthday Message</h4>
                <p>Customize the WhatsApp birthday message sent to customers.</p>
            </div>
        </div>

        <div class="form-grid">
            <label class="full-field">
                Birthday WhatsApp Message
                <textarea id="birthdayMessageInput" rows="10"
                    placeholder="Write your birthday message...">${savedMessage}</textarea>
            </label>
        </div>

        <div class="modal-actions">
            <button class="primary-btn" onclick="saveBirthdayMessage()">
                💾 Save Message
            </button>
        </div>

        <p class="muted" style="margin-top:12px;">
            Use <strong>{name}</strong> where you want the customer's name to appear automatically.
        </p>
    </section>`;
}

function saveBirthdayMessage() {
    const input = document.getElementById("birthdayMessageInput");

    if (!input) return;

    localStorage.setItem("birthdayMessage", input.value);

    alert("Birthday message saved successfully! 🎉");
}

function birthdayPanelHTML() {
    const birthdays = getTodayBirthdays();

    if (birthdays.length === 0) {
        return `
        <section class="panel birthday-panel">
            <div class="panel-header">
                <div>
                    <h4>🎂 Today's Birthdays</h4>
                    <p>No customer birthdays today.</p>
                </div>
            </div>
        </section>`;
    }

    return `
    <section class="panel birthday-panel">
        <div class="panel-header">
            <div>
                <h4>🎂 Today's Birthdays</h4>
                <p>Customers celebrating their birthday today</p>
            </div>
        </div>

        <div class="birthday-list">
            ${birthdays.map(lead => `
                <div class="birthday-row">
                    <div class="avatar">${initials(lead.name)}</div>

                    <div class="birthday-info">
                        <strong>${lead.name}</strong>
                        <small>${lead.whatsapp || lead.phone || "No WhatsApp number"}</small>
                    </div>

                    <button 
                        class="primary-btn"
                        onclick="openBirthdayWhatsApp(${lead.id})">
                        🎉 Send Wish
                    </button>
                </div>
            `).join("")}
        </div>
    </section>`;
}

function dashboardHTML(){
 return `
 <div class="welcome-row"><div><p class="muted">${new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p><h3>${new Date().getHours()<12?"Good morning":new Date().getHours()<17?"Good afternoon":"Good evening"}, ${window.currentEmployee?.name || "User"} 👋</h3><p class="muted">Here is today's ${currentCompany?.name || "JMD Property"} overview.</p></div><button class="primary-btn" id="addLeadBtn">+ Add Lead</button></div>
 <div class="stats-grid">
  <article class="stat-card"><div class="stat-icon blue">◉</div><div><span>Total Leads</span><strong>${leads.length}</strong><small class="positive">+12 this week</small></div></article>
  <article class="stat-card"><div class="stat-icon orange">↻</div><div><span>Follow-ups Due</span><strong>18</strong><small class="warning">5 overdue</small></div></article>
  <article class="stat-card"><div class="stat-icon green">⌖</div><div><span>Site Visits</span><strong>7</strong><small class="positive">Today</small></div></article>
  <article class="stat-card"><div class="stat-icon purple">★</div><div><span>Hot Leads</span><strong>${leads.filter(l=>l.status==="Hot").length}</strong><small class="positive">Priority leads</small></div></article>
 </div>
${birthdayPanelHTML()}
 <div class="dashboard-grid">
  <section class="panel"><div class="panel-header"><div><h4>Today's Follow-ups</h4><p>Customers that need attention today</p></div><button class="text-btn" data-nav="followups">View all →</button></div>
   <div class="lead-list">${leads.slice(0,3).map(l=>`<div class="lead-row"><div class="avatar">${initials(l.name)}</div><div class="lead-main"><strong>${l.name}</strong><span>${l.project} • ${l.budget}</span></div><span class="status ${statusClass(l.status)}">${l.status}</span><button class="row-action" onclick="viewLead(${l.id})">View</button></div>`).join("")}</div>
  </section>
  <section class="panel"><div class="panel-header"><div><h4>Today's Site Visits</h4><p>Upcoming customer visits</p></div><button class="text-btn" data-nav="visits">View all →</button></div>
   <div class="visit-list">${leads.filter(l=>l.status==="Site Visit Planned").map(l=>`<div class="visit-row"><div class="time-box"><strong>${formatTime(l.followupTime||"10:00")}</strong><span>${(l.followupTime||"10:00").slice(0,2)<12?"AM":"PM"}</span></div><div><strong>${l.name}</strong><span>${l.project} • ${l.assigned}</span></div><span class="visit-dot scheduled"></span></div>`).join("") || '<p class="empty-state">No site visits scheduled.</p>'}</div>
  </section>
 </div>
 <section class="panel"><div class="panel-header"><div><h4>Recent Leads</h4><p>Latest enquiries from all sources</p></div><button class="text-btn" data-nav="leads">All leads →</button></div>
 <div class="table-wrap"><table><thead><tr><th>Customer</th><th>Project</th><th>Requirement</th><th>Source</th><th>Status</th><th>Assigned To</th></tr></thead><tbody><th>ACTIONS</th>
 ${leads.slice(0,5).map(l=>`<tr><td><strong>${l.name}</strong><small>${l.phone}</small></td><td>${l.project}</td><td>${l.type}</td><td>${l.source}</td><td><span class="status ${statusClass(l.status)}">${l.status}</span></td><td>${l.assigned}</td></tr>`).join("")}
 </tbody></table></div></section>`;
}


// =====================================================
// C1PX - PROFESSIONAL LEAD DETAILS
// =====================================================
function leadById(id){
  return leads.find(l => String(l.id) === String(id));
}

function escLead(value){
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function leadPhoneHref(phone){
  return String(phone ?? "").replace(/[^\d+]/g,"");
}

function openLeadDetails(id){
  const lead = leadById(id);
  if(!lead) return;

  const phone = leadPhoneHref(lead.phone || lead.whatsapp);
  const email = String(lead.email || "").trim();
  const notes = lead.notes || lead.note || "";
  const followup = lead.followupDate
    ? `${formatDate(lead.followupDate)}${lead.followupTime ? " • " + formatTime(lead.followupTime) : ""}`
    : "No follow-up scheduled";

  let modal = document.getElementById("leadDetailsModal");
  if(!modal){
    modal = document.createElement("div");
    modal.id = "leadDetailsModal";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="lead-details-modal" role="dialog" aria-modal="true">
      <div class="lead-details-head">
        <div class="lead-profile-title">
          <div class="lead-big-avatar">${escLead(initials(lead.name || "?"))}</div>
          <div>
            <div class="eyebrow">LEAD PROFILE</div>
            <h2>${escLead(lead.name || "Unnamed Lead")}</h2>
            <div class="muted">${escLead(lead.phone || "No mobile number")} ${email ? "• " + escLead(email) : ""}</div>
          </div>
        </div>
        <button class="modal-close" onclick="closeLeadDetails()" aria-label="Close">×</button>
      </div>

      <div class="lead-quick-actions">
        ${phone ? `<a class="primary-btn" href="tel:${escLead(phone)}">☎ Call</a>` : ""}
        ${phone ? `<a class="secondary-btn" target="_blank" rel="noopener" href="https://wa.me/${escLead(phone.replace(/^\\+/,""))}">◉ WhatsApp</a>` : ""}
        ${email ? `<a class="secondary-btn" href="mailto:${escLead(email)}">✉ Email</a>` : ""}
        <button class="secondary-btn" onclick="editLead(${Number(lead.id)})">✎ Edit Lead</button>
        <button class="secondary-btn" onclick="closeLeadDetails();scheduleVisit(${Number(lead.id)})">＋ Follow-up</button>
      </div>

      <div class="lead-detail-grid">
        <section class="detail-card">
          <div class="detail-card-title">Customer Information</div>
          <div class="detail-fields">
            <div><span>Name</span><strong>${escLead(lead.name || "—")}</strong></div>
            <div><span>Mobile</span><strong>${escLead(lead.phone || "—")}</strong></div>
            <div><span>Email</span><strong>${escLead(lead.email || "—")}</strong></div>
            <div><span>Location</span><strong>${escLead(lead.location || "—")}</strong></div>
            <div><span>Job Title</span><strong>${escLead(lead.job_title || "—")}</strong></div>
            <div><span>Source</span><strong>${escLead(lead.source || "—")}</strong></div>
          </div>
        </section>

        <section class="detail-card">
          <div class="detail-card-title">Property Interest</div>
          <div class="detail-fields">
            <div><span>Project</span><strong>${escLead(lead.project || "—")}</strong></div>
            <div><span>Property Type</span><strong>${escLead(lead.type || "—")}</strong></div>
            <div><span>Budget</span><strong>${escLead(lead.budget || "—")}</strong></div>
            <div><span>Status</span><strong><span class="status ${statusClass(lead.status)}">${escLead(lead.status || "New")}</span></strong></div>
            <div><span>Assigned To</span><strong>${escLead(lead.assigned || "—")}</strong></div>
            <div><span>Meta Lead ID</span><strong>${escLead(lead.external_lead_id || "—")}</strong></div>
          </div>
        </section>

        <section class="detail-card detail-card-wide">
          <div class="detail-card-title">Next Follow-up</div>
          <div class="followup-highlight">
            <div><span class="muted">Scheduled</span><strong>${escLead(followup)}</strong></div>
            <button class="secondary-btn" onclick="closeLeadDetails();scheduleVisit(${Number(lead.id)})">Schedule / Update</button>
          </div>
        </section>

        <section class="detail-card detail-card-wide">
          <div class="detail-card-title">Notes</div>
          <div class="lead-notes">${notes ? escLead(notes).replace(/\\n/g,"<br>") : '<span class="muted">No notes added yet.</span>'}</div>
        </section>
      </div>
    </div>`;

  modal.classList.add("show");
  modal.onclick = e => { if(e.target === modal) closeLeadDetails(); };
}

function closeLeadDetails(){
  const modal = document.getElementById("leadDetailsModal");
  if(modal) modal.classList.remove("show");
}

window.openLeadDetails = openLeadDetails;
window.closeLeadDetails = closeLeadDetails;

function leadsHTML(){
 return `
 <div class="page-toolbar"><div><span class="eyebrow">CUSTOMER PIPELINE</span><h3>Leads</h3><p class="muted">Manage and track all property enquiries.</p></div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="secondary-btn" id="importLeadsBtn">↥ Import Leads</button><button class="primary-btn" id="addLeadBtn">+ Add Lead</button></div></div>
 <div class="lead-summary">
  <div class="mini-stat"><span>Total Leads</span><strong>${leads.length}</strong></div>
  <div class="mini-stat"><span>New Leads</span><strong>${leads.filter(l=>l.status==="New").length}</strong></div>
  <div class="mini-stat"><span>Hot Leads</span><strong>${leads.filter(l=>l.status==="Hot").length}</strong></div>
  <div class="mini-stat"><span>Site Visit Leads</span><strong>${leads.filter(l=>(l.status||"").includes("Site Visit")).length}</strong></div>
  <div class="mini-stat"><span>Booked Leads</span><strong>${leads.filter(l=>l.status==="Booked").length}</strong></div>
 </div>
 <section class="panel lead-panel">
  <div class="filter-bar">
   <div class="search-box" style="flex:1;min-width:260px;"><span>⌕</span><input id="leadSearch" autocomplete="off" placeholder="Search name, mobile, email, project, location or Meta Lead ID..."></div>
   <select id="statusFilter"><option value="">All Status</option>${statuses.map(s=>`<option value="${s}">${s}</option>`).join("")}<option value="Hot">Hot</option></select>
   <select id="projectFilter"><option value="">All Projects</option>${projects.map(p=>`<option value="${p}">${p}</option>`).join("")}</select>
   <select id="typeFilter"><option value="">All Types</option>${types.map(t=>`<option value="${t}">${t}</option>`).join("")}</select>
   <select id="sourceFilter"><option value="">All Sources</option>${sources.map(s=>`<option value="${s}">${s}</option>`).join("")}</select>
   <select id="assignedFilter"><option value="">All Employees</option>${employees.map(e=>`<option value="${e}">${e}</option>`).join("")}</select>
   <button class="secondary-btn" id="clearLeadFiltersBtn" type="button">Clear Filters</button>
  </div>
  <div id="leadFilterSummary" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:12px 0 10px;font-size:13px;"></div>
  <div class="table-wrap"><table class="leads-table"><thead><tr><th>Customer</th><th>Job Title</th><th>Project</th><th>Type</th><th>Budget</th><th>Source</th><th>Status</th><th>Assigned To</th><th>Follow-up</th><th>Actions</th></tr></thead><tbody id="leadsTableBody"></tbody></table></div>
 </section>`;
}
function renderLeadRows(){
 const body = document.getElementById("leadsTableBody");
 if(!body) return;

 const searchRaw = (document.getElementById("leadSearch")?.value || "").trim().toLowerCase();
 const search = searchRaw.replace(/[^a-z0-9@+.#\- ]/g, " ");
 const sf = document.getElementById("statusFilter")?.value || "";
 const pf = document.getElementById("projectFilter")?.value || "";
 const tf = document.getElementById("typeFilter")?.value || "";
 const src = document.getElementById("sourceFilter")?.value || "";
 const af = document.getElementById("assignedFilter")?.value || "";

 const filtered = leads.filter(l => {
   const searchable = [
     l.name, l.phone, l.email, l.job_title, l.project, l.type, l.source,
     l.assigned, l.location, l.external_lead_id, l.whatsapp
   ].map(v => String(v ?? "").toLowerCase()).join(" ");

   return (!search || searchable.includes(search)) &&
     (!sf || l.status === sf) &&
     (!pf || l.project === pf) &&
     (!tf || l.type === tf) &&
     (!src || l.source === src) &&
     (!af || l.assigned === af);
 });

 const summary = document.getElementById("leadFilterSummary");
 const activeFilters = [];
 if(searchRaw) activeFilters.push(`Search: "${searchRaw}"`);
 if(sf) activeFilters.push(`Status: ${sf}`);
 if(pf) activeFilters.push(`Project: ${pf}`);
 if(tf) activeFilters.push(`Type: ${tf}`);
 if(src) activeFilters.push(`Source: ${src}`);
 if(af) activeFilters.push(`Employee: ${af}`);

 if(summary){
   summary.innerHTML = `
     <span><strong>${filtered.length}</strong> of ${leads.length} leads shown${activeFilters.length ? ` • ${activeFilters.join(" • ")}` : ""}</span>
     ${activeFilters.length ? '<span style="color:#64748b;">Filters active</span>' : '<span style="color:#64748b;">Showing all leads</span>'}
   `;
 }

 body.innerHTML = filtered.length ? filtered.map(l=>`
 <tr>
  <td><div class="customer-cell"><div class="avatar">${initials(l.name || "?")}</div><div><strong>${l.name || "—"}</strong><small>${l.phone || "No mobile"}</small></div></div></td>
  <td>${l.job_title || "—"}</td>
  <td>${l.project || "—"}</td><td>${l.type || "—"}</td><td>${l.budget || "—"}</td><td>${l.source || "—"}</td>
  <td><span class="status ${statusClass(l.status)}">${l.status || "New"}</span></td><td>${l.assigned || "—"}</td>
  <td>${l.followupDate ? `${formatDate(l.followupDate)}<small>${formatTime(l.followupTime)}</small>` : "—"}</td>
  <td><div class="action-buttons"><button onclick="openLeadDetails(${l.id})" title="View full lead">View</button><button onclick="editLead(${l.id})" title="Edit">Edit</button><button onclick="scheduleVisit(${l.id})" title="Site Visit">Visit</button></div></td>
 </tr>`).join("") : `<tr><td colspan="10"><div class="empty-state">No leads found. Try changing your search or filters.</div></td></tr>`;
}

// =====================================================
// C1PX - LEAD IMPORT (CSV / XLS / XLSX)
// =====================================================

let c1pxImportRows = [];
let c1pxImportHeaders = [];

const IMPORT_FIELDS = [
    { key: "name", label: "Customer Name", required: true, aliases: ["name","full name","full_name","customer name","customer_name","lead name","lead_name"] },
    { key: "phone", label: "Mobile", aliases: ["phone","phone number","phone_number","mobile","mobile number","mobile_number","contact number"] },
    { key: "email", label: "Email", aliases: ["email","email address","email_address"] },    { key: "job_title", label: "Job Title", aliases: ["job title","job_title","designation","occupation","profession","work"] },

    { key: "whatsapp", label: "WhatsApp", aliases: ["whatsapp","whatsapp number","whatsapp_number"] },
    { key: "location", label: "Location", aliases: ["location","city","address"] },
    { key: "project", label: "Project", aliases: ["project","project name","project_name","interested project"] },
    { key: "type", label: "Property Type", aliases: ["type","property type","property_type","requirement"] },
    { key: "budget", label: "Budget", aliases: ["budget","budget range","budget_range"] },
    { key: "status", label: "Status", aliases: ["status","lead status","lead_status"] },
    { key: "assigned_employee", label: "Assigned Employee", aliases: ["assigned","assigned to","assigned employee","assigned_employee","employee"] },
    { key: "follow_up_date", label: "Follow-up Date", aliases: ["follow-up date","follow up date","follow_up_date","followup date","followup_date"] },
    { key: "follow_up_time", label: "Follow-up Time", aliases: ["follow-up time","follow up time","follow_up_time","followup time","followup_time"] },
    { key: "dob", label: "Date of Birth", aliases: ["dob","date of birth","date_of_birth","birthday","birth date"] },
    { key: "notes", label: "Notes", aliases: ["notes","note","message","comments","description"] },
    { key: "campaign_name", label: "Campaign", aliases: ["campaign","campaign name","campaign_name"] },
    { key: "ad_set_name", label: "Ad Set", aliases: ["ad set","ad_set","ad set name","ad_set_name"] },
    { key: "ad_name", label: "Ad", aliases: ["ad","ad name","ad_name"] },
    { key: "form_name", label: "Form", aliases: ["form","form name","form_name","instant form","instant_form"] },
    { key: "external_lead_id", label: "Meta Lead ID", aliases: ["id","lead id","lead_id","lead id"] }
];

function importNormalizeHeader(value) {
    return String(value ?? "").trim().toLowerCase().replace(/[_\-]+/g," ").replace(/\s+/g," ");
}

function importFindHeader(field) {
    const aliases = field.aliases.map(importNormalizeHeader);
    return c1pxImportHeaders.find(h => aliases.includes(importNormalizeHeader(h))) || "";
}

function importEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}

function openLeadImportModal() {
    const old = document.getElementById("leadImportModal");
    if (old) old.remove();

    const modal = document.createElement("div");
    modal.id = "leadImportModal";
    modal.className = "modal-overlay show";
    modal.style.zIndex = "99999";
    modal.innerHTML = `
      <div class="modal import-leads-modal" style="max-height:92vh;overflow:auto;">
        <div class="modal-header">
          <div><span class="eyebrow">LEAD IMPORT</span><h3>Import Leads</h3><p class="muted">Upload Meta/Facebook CSV, XLS or XLSX files.</p></div>
          <button class="close-btn" onclick="closeLeadImportModal()">×</button>
        </div>
        <div class="import-dropzone" id="leadImportDropzone">
          <div style="font-size:30px;margin-bottom:8px;">📥</div>
          <strong>Choose a CSV / XLS / XLSX file</strong>
          <p class="muted" style="margin:7px 0 0;">You can also drag and drop the file here.</p>
          <input id="leadImportFile" type="file" accept=".csv,.xls,.xlsx" style="display:none;">
        </div>
        <div id="leadImportBody"></div>
      </div>`;
    document.body.appendChild(modal);

    const zone = document.getElementById("leadImportDropzone");
    const input = document.getElementById("leadImportFile");
    zone.addEventListener("click", () => input.click());
    zone.addEventListener("dragover", e => { e.preventDefault(); zone.style.borderColor="#2563eb"; });
    zone.addEventListener("dragleave", () => zone.style.borderColor="");
    zone.addEventListener("drop", e => { e.preventDefault(); zone.style.borderColor=""; if(e.dataTransfer.files[0]) processLeadImportFile(e.dataTransfer.files[0]); });
    input.addEventListener("change", e => { if(e.target.files[0]) processLeadImportFile(e.target.files[0]); });
}

window.closeLeadImportModal = function() {
    document.getElementById("leadImportModal")?.remove();
    c1pxImportRows = [];
    c1pxImportHeaders = [];
};

async function processLeadImportFile(file) {
    const body = document.getElementById("leadImportBody");
    if (!body) return;
    body.innerHTML = `<div style="padding:18px 0;">Reading <strong>${importEscape(file.name)}</strong>...</div>`;
    try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type:"array", cellDates:true });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval:"", raw:false });
        if (!rows.length) throw new Error("The file does not contain any lead rows.");
        c1pxImportRows = rows;
        c1pxImportHeaders = Object.keys(rows[0]);
        renderLeadImportMapping(file.name);
    } catch (err) {
        body.innerHTML = `<div style="padding:18px;color:#dc2626;">❌ ${importEscape(err.message || "Could not read this file.")}</div>`;
    }
}

function renderLeadImportMapping(fileName) {
    const body = document.getElementById("leadImportBody");
    if (!body) return;
    const options = `<option value="">— Do not import —</option>` + c1pxImportHeaders.map(h => `<option value="${importEscape(h)}">${importEscape(h)}</option>`).join("");
    const mappings = IMPORT_FIELDS.map(field => {
        const matched = importFindHeader(field);
        return `<div class="import-map-item"><label>${importEscape(field.label)}${field.required ? " *" : ""}</label><select data-import-field="${field.key}"><option value="">— Do not import —</option>${c1pxImportHeaders.map(h => `<option value="${importEscape(h)}" ${h===matched?"selected":""}>${importEscape(h)}</option>`).join("")}</select></div>`;
    }).join("");
    const previewHeaders = c1pxImportHeaders.slice(0,8);
    const preview = c1pxImportRows.slice(0,5).map(row => `<tr>${previewHeaders.map(h => `<td>${importEscape(row[h])}</td>`).join("")}</tr>`).join("");
    body.innerHTML = `
      <div class="import-stats"><div class="import-stat"><strong>${c1pxImportRows.length}</strong> rows detected</div><div class="import-stat"><strong>${importEscape(fileName)}</strong></div></div>
      <h4 style="margin:18px 0 8px;">Map columns</h4>
      <p class="muted" style="margin:0;">C1PX auto-detects common Meta column names. Change any mapping before importing.</p>
      <div class="import-map-grid">${mappings}</div>
      <h4 style="margin:22px 0 8px;">Duplicate protection</h4>
      <div style="padding:12px 14px;border:1px solid #bfdbfe;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-size:13px;">
        C1PX checks Meta Lead ID, mobile number and email. If a matching lead already exists, it will be skipped and you will be shown which leads were already in the CRM.
      </div>
      <input type="hidden" id="leadImportDuplicateMode" value="skip">
      <div class="import-preview"><table><thead><tr>${previewHeaders.map(h=>`<th>${importEscape(h)}</th>`).join("")}</tr></thead><tbody>${preview}</tbody></table></div>
      <div id="leadImportMessage" style="margin-top:14px;font-size:14px;"></div>
      <div class="modal-actions" style="margin-top:18px;"><button class="secondary-btn" onclick="closeLeadImportModal()">Cancel</button><button class="primary-btn" id="confirmLeadImportBtn" onclick="confirmLeadImport()">Import ${c1pxImportRows.length} Leads</button></div>`;
}

function importCell(row, fieldKey) {
    const field = IMPORT_FIELDS.find(x => x.key === fieldKey);
    if (!field) return "";
    const header = document.querySelector(`[data-import-field="${fieldKey}"]`)?.value || "";
    return header ? String(row[header] ?? "").trim() : "";
}

function importDate(value) {
    if (!value) return null;
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0,10);
    const m = String(value).match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (m) return `${m[3]}-${String(m[2]).padStart(2,"0")}-${String(m[1]).padStart(2,"0")}`;
    return null;
}

function importTime(value) {
    if (!value) return null;
    const s = String(value).trim();
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(s)) return s;
    const d = new Date(`1970-01-01T${s}`);
    if (!Number.isNaN(d.getTime())) return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    return s;
}

async function confirmLeadImport() {
    if (!currentCompany) await loadCompany();
    const message = document.getElementById("leadImportMessage");
    const button = document.getElementById("confirmLeadImportBtn");
    if (!currentCompany) { message.textContent="❌ Company could not be loaded."; return; }

    const mode = document.getElementById("leadImportDuplicateMode")?.value || "skip";
    const records = [];
    let invalid = 0;
    for (const row of c1pxImportRows) {
        const name = importCell(row,"name");
        if (!name) { invalid++; continue; }
        records.push({
            company_id: currentCompany.id,
            name,
            phone: importCell(row,"phone") || null,
            email: importCell(row,"email") || null,
            job_title: importCell(row,"job_title") || null,
            whatsapp: importCell(row,"whatsapp") || importCell(row,"phone") || null,
            dob: importDate(importCell(row,"dob")),
            location: importCell(row,"location") || null,
            budget: importCell(row,"budget") || null,
            project: importCell(row,"project") || null,
            type: importCell(row,"type") || null,
            source: "Facebook Ads",
            status: importCell(row,"status") || "New",
            assigned_employee: importCell(row,"assigned_employee") || null,
            follow_up_date: importDate(importCell(row,"follow_up_date")),
            follow_up_time: importTime(importCell(row,"follow_up_time")),
            follow_up_completed: false,
            notes: importCell(row,"notes") || null,
            campaign_name: importCell(row,"campaign_name") || null,
            ad_set_name: importCell(row,"ad_set_name") || null,
            ad_name: importCell(row,"ad_name") || null,
            form_name: importCell(row,"form_name") || null,
            source_platform: "Meta",
            external_lead_id: importCell(row,"external_lead_id") || null
        });
    }
    if (!records.length) { message.textContent="❌ No valid leads found. Customer Name is required."; return; }

    button.disabled = true; button.textContent = "Checking duplicates...";
    try {
        // C1PX duplicate protection:
        // Match normalized Meta Lead ID, phone or email against existing
        // leads in the current company, and also prevent duplicates within
        // the same uploaded file.
        const { data: existingData, error: existingError } = await db
            .from("leads")
            .select("id,phone,email,external_lead_id,company_id")
            .eq("company_id", currentCompany.id);

        if (existingError) throw existingError;

        const normalizePhone = value => {
            const digits = String(value ?? "").replace(/\D/g, "");
            return digits.length > 10 ? digits.slice(-10) : digits;
        };

        const normalizeEmail = value =>
            String(value ?? "").trim().toLowerCase();

        const normalizeMetaId = value =>
            String(value ?? "").trim();

        const existingByKey = new Map();

        for (const row of (existingData || [])) {
            const phoneKey = normalizePhone(row.phone);
            const emailKey = normalizeEmail(row.email);
            const metaKey = normalizeMetaId(row.external_lead_id);

            if (metaKey) existingByKey.set(`meta:${metaKey}`, row);
            if (phoneKey) existingByKey.set(`phone:${phoneKey}`, row);
            if (emailKey) existingByKey.set(`email:${emailKey}`, row);
        }

        const importedKeys = new Set();
        const toInsert = [];
        const toUpdate = [];
        const duplicateDetails = [];

        for (const r of records) {
            const metaKey = normalizeMetaId(r.external_lead_id);
            const phoneKey = normalizePhone(r.phone);
            const emailKey = normalizeEmail(r.email);

            const keys = [];
            if (metaKey) keys.push(`meta:${metaKey}`);
            if (phoneKey) keys.push(`phone:${phoneKey}`);
            if (emailKey) keys.push(`email:${emailKey}`);

            const match = keys
                .map(key => existingByKey.get(key))
                .find(Boolean);

            const duplicateInsideFile =
                keys.some(key => importedKeys.has(key));

            if (duplicateInsideFile) {
                duplicateDetails.push({
                    name: r.name || "Unnamed lead",
                    reason: "Duplicate inside uploaded file"
                });
                continue;
            }

            if (match && mode === "skip") {
                const matchedBy = metaKey && existingByKey.get(`meta:${metaKey}`) ? "Meta Lead ID"
                    : phoneKey && existingByKey.get(`phone:${phoneKey}`) ? "mobile number"
                    : emailKey && existingByKey.get(`email:${emailKey}`) ? "email"
                    : "matching details";
                duplicateDetails.push({
                    name: r.name || "Unnamed lead",
                    reason: `Already in CRM — matched by ${matchedBy}${match.name ? ` (${match.name})` : ""}`
                });
                keys.forEach(key => importedKeys.add(key));
                continue;
            }

            if (match && mode === "update") {
                toUpdate.push({ id: match.id, ...r });
                keys.forEach(key => importedKeys.add(key));
                continue;
            }

            toInsert.push(r);
            keys.forEach(key => importedKeys.add(key));
        }

        button.textContent = "Importing...";
        if (toInsert.length) {
            for (let i=0;i<toInsert.length;i+=500) {
                const {data,error} = await db.from("leads").insert(toInsert.slice(i,i+500)).select();
                if (error) throw error;
                leads = [...(data||[]), ...leads];
            }
        }
        for (const r of toUpdate) {
            const {data,error} = await db.from("leads").update(r).eq("id",r.id).select().single();
            if (error) throw error;
            const idx = leads.findIndex(x => String(x.id)===String(r.id));
            if (idx>=0) leads[idx]=data; else leads.unshift(data);
        }
        await loadLeads();
        closeLeadImportModal();
        await loadPage("leads");

        const duplicateSummary = duplicateDetails.length
            ? `\n\nAlready in CRM (${duplicateDetails.length}):\n${duplicateDetails.slice(0, 20).map((d, i) => `${i + 1}. ${d.name} — ${d.reason}`).join("\n")}${duplicateDetails.length > 20 ? `\n...and ${duplicateDetails.length - 20} more.` : ""}`
            : "";

        alert(`✅ Lead import complete!\nImported: ${toInsert.length}\nUpdated: ${toUpdate.length}\nSkipped: ${records.length-toInsert.length-toUpdate.length}\nInvalid rows: ${invalid}${duplicateSummary}`);
    } catch (err) {
        console.error("C1PX Lead Import Error:",err);
        message.textContent = `❌ ${err.message || "Lead import failed."}`;
        button.disabled = false; button.textContent = `Import ${c1pxImportRows.length} Leads`;
    }
}

function customersHTML(){
 return `
 <div class="page-toolbar">
   <div><span class="eyebrow">CUSTOMER DATABASE</span><h3>Customers</h3><p class="muted">Manage converted customers and customer profiles.</p></div>
   <button class="primary-btn" onclick="openCustomerForm()">+ Add Customer</button>
 </div>
 <section class="panel">
   <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
     <input id="customerSearch" placeholder="Search name, mobile, email..." style="flex:1;min-width:220px;padding:11px;border:1px solid #d1d5db;border-radius:9px;" oninput="renderCustomerRows()">
     <button class="secondary-btn" onclick="loadCustomers()">Refresh</button>
   </div>
   <div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="padding:12px;text-align:left">Customer</th><th style="padding:12px;text-align:left">Mobile</th><th style="padding:12px;text-align:left">Project</th><th style="padding:12px;text-align:left">Assigned To</th><th style="padding:12px;text-align:left">Status</th><th style="padding:12px;text-align:left">Actions</th></tr></thead><tbody id="customerRows"><tr><td colspan="6" class="table-loading">Loading customers...</td></tr></tbody></table></div>
 </section>
 <div id="customerModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;align-items:center;justify-content:center;padding:20px;">
  <div style="background:#fff;border-radius:16px;padding:24px;width:100%;max-width:520px;box-shadow:0 20px 60px rgba(0,0,0,.2)">
   <h3 id="customerModalTitle">Add Customer</h3>
   <input type="hidden" id="customerId">
   <div style="display:grid;gap:10px">
    <input id="customerName" placeholder="Customer name">
    <input id="customerMobile" placeholder="Mobile">
    <input id="customerEmail" placeholder="Email">
    <input id="customerJobTitle" placeholder="Job title">
    <input id="customerProject" placeholder="Project">
    <select id="customerStatus"><option>Active</option><option>Prospect</option><option>Booked</option><option>Inactive</option></select>
    <textarea id="customerNotes" placeholder="Notes" rows="4"></textarea>
   </div>
   <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px"><button class="secondary-btn" onclick="closeCustomerForm()">Cancel</button><button class="primary-btn" onclick="saveCustomer()">Save Customer</button></div>
  </div>
 </div>`;
}

function genericPage(title,desc,label){
  return `<div class="page-toolbar"><div><span class="eyebrow">${label}</span><h3>${title}</h3><p class="muted">${desc}</p></div></div><section class="panel empty-page"><div class="empty-ico">...</div><h3>Coming soon</h3><p class="muted">This section is ready for the next build step.</p></section>`;
}


// =====================================================
// C1PX - CUSTOMERS / TASKS / MEETINGS / NOTIFICATIONS
// =====================================================
let c1pxCustomers = [];
let c1pxTasks = [];
let c1pxMeetings = [];
let c1pxNotifications = [];

async function loadCustomers(){
 if(!currentCompany) await loadCompany();
 if(!currentCompany) return;
 const {data,error}=await db.from("customers").select("*").eq("company_id",currentCompany.id).order("created_at",{ascending:false});
 if(error){console.error(error); return;}
 c1pxCustomers=data||[];
 renderCustomerRows();
}
function renderCustomerRows(){
 const el=document.getElementById("customerRows"); if(!el)return;
 const q=(document.getElementById("customerSearch")?.value||"").toLowerCase();
 const rows=c1pxCustomers.filter(c=>[c.name,c.mobile,c.email,c.project,c.job_title].some(v=>String(v||"").toLowerCase().includes(q)));
 if(!rows.length){el.innerHTML='<tr><td colspan="6" class="table-loading">No customers found.</td></tr>';return;}
 el.innerHTML=rows.map(c=>`<tr style="border-top:1px solid #e5e7eb"><td style="padding:12px"><strong>${escapeHtml(c.name||"—")}</strong><div class="muted">${escapeHtml(c.email||"")}</div></td><td style="padding:12px">${escapeHtml(c.mobile||"—")}</td><td style="padding:12px">${escapeHtml(c.project||"—")}</td><td style="padding:12px">${escapeHtml(c.assigned_employee||"—")}</td><td style="padding:12px">${escapeHtml(c.status||"Active")}</td><td style="padding:12px"><button class="secondary-btn" onclick="editCustomer('${c.id}')">Edit</button><button class="secondary-btn" style="margin-left:8px;color:#dc2626" onclick="deleteCustomer('${c.id}')">Delete</button></td></tr>`).join("");
}
window.openCustomerForm=function(id=null){
 const m=document.getElementById("customerModal"); if(!m)return; m.style.display="flex";
 const c=id?c1pxCustomers.find(x=>String(x.id)===String(id)):null;
 document.getElementById("customerModalTitle").textContent=c?"Edit Customer":"Add Customer";
 document.getElementById("customerId").value=c?.id||"";
 document.getElementById("customerName").value=c?.name||""; document.getElementById("customerMobile").value=c?.mobile||"";
 document.getElementById("customerEmail").value=c?.email||""; document.getElementById("customerJobTitle").value=c?.job_title||"";
 document.getElementById("customerProject").value=c?.project||""; document.getElementById("customerStatus").value=c?.status||"Active"; document.getElementById("customerNotes").value=c?.notes||"";
};
window.closeCustomerForm=function(){document.getElementById("customerModal")?.style.setProperty("display","none");};
window.editCustomer=id=>openCustomerForm(id);
window.deleteCustomer=async function(id){if(!confirm("Delete this customer?"))return;const{error}=await db.from("customers").delete().eq("id",id).eq("company_id",currentCompany.id);if(error){alert(error.message);return;}await loadCustomers()};
window.saveCustomer=async function(){
 if(!currentCompany) await loadCompany();
 const id=document.getElementById("customerId").value;
 const payload={company_id:currentCompany.id,name:document.getElementById("customerName").value.trim(),mobile:document.getElementById("customerMobile").value.trim()||null,email:document.getElementById("customerEmail").value.trim()||null,job_title:document.getElementById("customerJobTitle").value.trim()||null,project:document.getElementById("customerProject").value.trim()||null,status:document.getElementById("customerStatus").value,notes:document.getElementById("customerNotes").value.trim()||null};
 if(!payload.name){alert("Enter customer name.");return;}
 const q=id?db.from("customers").update(payload).eq("id",id).eq("company_id",currentCompany.id):db.from("customers").insert(payload);
 const {error}=await q; if(error){alert(error.message);return;} closeCustomerForm(); await loadCustomers();
};

function tasksHTML(){return `<div class="page-toolbar"><div><span class="eyebrow">PRODUCTIVITY</span><h3>Tasks</h3><p class="muted">Assign and track CRM work.</p></div><button class="primary-btn" onclick="openTaskForm()">+ Add Task</button></div><section class="panel"><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px"><input id="taskSearch" placeholder="Search tasks..." oninput="renderTaskRows()" style="flex:1;min-width:220px;padding:11px;border:1px solid #d1d5db;border-radius:9px"><select id="taskStatusFilter" onchange="renderTaskRows()" style="padding:11px;border:1px solid #d1d5db;border-radius:9px"><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select></div><div id="taskRows"></div></section>`}
function meetingsHTML(){return `<div class="page-toolbar"><div><span class="eyebrow">CALENDAR</span><h3>Meetings</h3><p class="muted">Schedule and track customer meetings.</p></div><button class="primary-btn" onclick="openMeetingForm()">+ Add Meeting</button></div><section class="panel"><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px"><input id="meetingSearch" placeholder="Search meetings..." oninput="renderMeetingRows()" style="flex:1;min-width:220px;padding:11px;border:1px solid #d1d5db;border-radius:9px"><select id="meetingStatusFilter" onchange="renderMeetingRows()" style="padding:11px;border:1px solid #d1d5db;border-radius:9px"><option>All</option><option>Scheduled</option><option>Completed</option><option>Cancelled</option></select></div><div id="meetingRows"></div></section>`}
function remindersHTML(){return `<div class="page-toolbar"><div><span class="eyebrow">REMINDERS</span><h3>Reminders</h3><p class="muted">All due and upcoming CRM follow-ups, visits, tasks and meetings in one place.</p></div><button class="secondary-btn" onclick="loadC1PXReminders()">Refresh</button></div><section class="panel"><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px"><input id="reminderSearch" placeholder="Search reminders..." oninput="renderC1PXReminders()" style="flex:1;min-width:220px;padding:11px;border:1px solid #d1d5db;border-radius:9px"><select id="reminderTypeFilter" onchange="renderC1PXReminders()" style="padding:11px;border:1px solid #d1d5db;border-radius:9px"><option>All</option><option>Follow-up</option><option>Site Visit</option><option>Task</option><option>Meeting</option></select><select id="reminderStateFilter" onchange="renderC1PXReminders()" style="padding:11px;border:1px solid #d1d5db;border-radius:9px"><option>All</option><option>Overdue</option><option>Today</option><option>Upcoming</option></select></div><div id="reminderRows" class="muted">Loading reminders...</div></section>`}
function notificationsHTML(){return `<div class="page-toolbar"><div><span class="eyebrow">SYSTEM</span><h3>Notifications</h3><p class="muted">CRM alerts and activity notifications.</p></div><button id="refreshNotificationsButton" class="secondary-btn" onclick="refreshNotifications()">Refresh</button></div><section class="panel"><div id="notificationRows" class="muted">Loading notifications...</div></section>`}
function taskModalHTML(editId=null){const old=document.getElementById("taskModal");if(old)old.remove();const task=editId?c1pxTasks.find(t=>String(t.id)===String(editId)):null;const d=document.createElement("div");d.id="taskModal";d.innerHTML=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px"><div style="background:#fff;border-radius:16px;padding:24px;width:100%;max-width:500px"><h3>${task?'Edit Task':'Add Task'}</h3><input id="taskId" type="hidden" value="${task?.id||''}"><input id="taskTitle" placeholder="Task title" value="${escapeHtml(task?.title||'')}" style="width:100%;padding:11px;margin:6px 0"><input id="taskDue" type="date" value="${task?.due_date||''}" style="width:100%;padding:11px;margin:6px 0"><select id="taskAssignee" style="width:100%;padding:11px;margin:6px 0"><option value="">Unassigned</option>${companyEmployees.map(e=>`<option ${task?.assigned_employee===e.name?'selected':''}>${escapeHtml(e.name||'')}</option>`).join("")}</select><select id="taskStatus" style="width:100%;padding:11px;margin:6px 0"><option ${task?.status==='Pending'||!task?'selected':''}>Pending</option><option ${task?.status==='In Progress'?'selected':''}>In Progress</option><option ${task?.status==='Completed'?'selected':''}>Completed</option></select><textarea id="taskNotes" placeholder="Notes" rows="4" style="width:100%;padding:11px;margin:6px 0">${escapeHtml(task?.notes||'')}</textarea><div style="display:flex;justify-content:flex-end;gap:10px;margin-top:12px"><button class="secondary-btn" onclick="document.getElementById('taskModal').remove()">Cancel</button><button class="primary-btn" onclick="saveTask()">Save</button></div></div></div>`;document.body.appendChild(d)}
window.openTaskForm=function(id=null){taskModalHTML(id)};
window.saveTask=async function(){if(!currentCompany)await loadCompany();const id=document.getElementById("taskId")?.value;const p={company_id:currentCompany.id,title:document.getElementById("taskTitle").value.trim(),due_date:document.getElementById("taskDue").value||null,assigned_employee:document.getElementById("taskAssignee").value||null,status:document.getElementById("taskStatus").value,notes:document.getElementById("taskNotes").value.trim()||null,updated_at:new Date().toISOString()};if(!p.title){alert("Enter task title.");return;}const q=id?db.from("tasks").update(p).eq("id",id).eq("company_id",currentCompany.id):db.from("tasks").insert(p);const{error}=await q;if(error){alert(error.message);return;}document.getElementById("taskModal")?.remove();await loadTasks();};
async function loadTasks(){if(!currentCompany)await loadCompany();const{data,error}=await db.from("tasks").select("*").eq("company_id",currentCompany.id).order("due_date",{ascending:true});if(error){console.error(error);return;}c1pxTasks=data||[];renderTaskRows()}
function renderTaskRows(){const el=document.getElementById("taskRows");if(!el)return;const q=(document.getElementById("taskSearch")?.value||"").toLowerCase(),f=document.getElementById("taskStatusFilter")?.value||"All";const rows=c1pxTasks.filter(t=>(f==="All"||t.status===f)&&[t.title,t.assigned_employee,t.notes].some(v=>String(v||"").toLowerCase().includes(q)));el.innerHTML=rows.length?rows.map(t=>`<div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:10px"><strong>${escapeHtml(t.title)}</strong><div class="muted">${escapeHtml(t.assigned_employee||"Unassigned")} · ${escapeHtml(t.due_date||"No due date")}</div><div style="margin-top:8px"><span>${escapeHtml(t.status||"Pending")}</span><button class="secondary-btn" style="margin-left:10px" onclick="openTaskForm('${t.id}')">Edit</button>${t.status!=="Completed"?`<button class="secondary-btn" style="margin-left:8px" onclick="completeTask('${t.id}')">Complete</button>`:''}<button class="secondary-btn" style="margin-left:8px;color:#dc2626" onclick="deleteTask('${t.id}')">Delete</button></div></div>`).join(""): '<div class="muted">No tasks found.</div>'}
window.completeTask=async function(id){const{error}=await db.from("tasks").update({status:"Completed",updated_at:new Date().toISOString()}).eq("id",id).eq("company_id",currentCompany.id);if(error){alert(error.message);return;}await loadTasks()};
window.deleteTask=async function(id){if(!confirm("Delete this task?"))return;const{error}=await db.from("tasks").delete().eq("id",id).eq("company_id",currentCompany.id);if(error){alert(error.message);return;}await loadTasks()};
window.openMeetingForm=function(id=null){const old=document.getElementById("meetingModal");if(old)old.remove();const m=id?c1pxMeetings.find(x=>String(x.id)===String(id)):null;const d=document.createElement("div");d.id="meetingModal";d.innerHTML=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px"><div style="background:#fff;border-radius:16px;padding:24px;width:100%;max-width:500px"><h3>${m?'Edit Meeting':'Add Meeting'}</h3><input id="meetingId" type="hidden" value="${m?.id||''}"><input id="meetingTitle" placeholder="Meeting title" value="${escapeHtml(m?.title||'')}" style="width:100%;padding:11px;margin:6px 0"><input id="meetingDate" type="date" value="${m?.meeting_date||''}" style="width:100%;padding:11px;margin:6px 0"><input id="meetingTime" type="time" value="${m?.meeting_time||''}" style="width:100%;padding:11px;margin:6px 0"><input id="meetingCustomer" placeholder="Customer" value="${escapeHtml(m?.customer_name||'')}" style="width:100%;padding:11px;margin:6px 0"><select id="meetingAssignee" style="width:100%;padding:11px;margin:6px 0"><option value="">Unassigned</option>${companyEmployees.map(e=>`<option ${m?.assigned_employee===e.name?'selected':''}>${escapeHtml(e.name||'')}</option>`).join("")}</select><select id="meetingStatus" style="width:100%;padding:11px;margin:6px 0"><option ${!m||m.status==='Scheduled'?'selected':''}>Scheduled</option><option ${m?.status==='Completed'?'selected':''}>Completed</option><option ${m?.status==='Cancelled'?'selected':''}>Cancelled</option></select><textarea id="meetingNotes" placeholder="Notes" rows="4" style="width:100%;padding:11px;margin:6px 0">${escapeHtml(m?.notes||'')}</textarea><div style="display:flex;justify-content:flex-end;gap:10px;margin-top:12px"><button class="secondary-btn" onclick="document.getElementById('meetingModal').remove()">Cancel</button><button class="primary-btn" onclick="saveMeeting()">Save</button></div></div></div>`;document.body.appendChild(d)};
window.saveMeeting=async function(){if(!currentCompany)await loadCompany();const id=document.getElementById("meetingId")?.value;const p={company_id:currentCompany.id,title:document.getElementById("meetingTitle").value.trim(),meeting_date:document.getElementById("meetingDate").value||null,meeting_time:document.getElementById("meetingTime").value||null,customer_name:document.getElementById("meetingCustomer").value.trim()||null,assigned_employee:document.getElementById("meetingAssignee").value||null,status:document.getElementById("meetingStatus").value,notes:document.getElementById("meetingNotes").value.trim()||null,updated_at:new Date().toISOString()};if(!p.title||!p.meeting_date){alert("Enter meeting title and date.");return;}const q=id?db.from("meetings").update(p).eq("id",id).eq("company_id",currentCompany.id):db.from("meetings").insert(p);const{error}=await q;if(error){alert(error.message);return;}document.getElementById("meetingModal")?.remove();await loadMeetings()};
async function loadMeetings(){if(!currentCompany)await loadCompany();const{data,error}=await db.from("meetings").select("*").eq("company_id",currentCompany.id).order("meeting_date",{ascending:true}).order("meeting_time",{ascending:true});if(error){console.error(error);return;}c1pxMeetings=data||[];renderMeetingRows()}
function renderMeetingRows(){const el=document.getElementById("meetingRows");if(!el)return;const q=(document.getElementById("meetingSearch")?.value||"").toLowerCase(),f=document.getElementById("meetingStatusFilter")?.value||"All";const rows=c1pxMeetings.filter(m=>(f==="All"||m.status===f)&&[m.title,m.customer_name,m.assigned_employee,m.notes].some(v=>String(v||"").toLowerCase().includes(q)));el.innerHTML=rows.length?rows.map(m=>`<div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:10px"><strong>${escapeHtml(m.title)}</strong><div class="muted">${escapeHtml(m.customer_name||"No customer")} · ${escapeHtml(m.meeting_date||"")} ${escapeHtml(m.meeting_time||"")} · ${escapeHtml(m.assigned_employee||"Unassigned")}</div><div style="margin-top:8px">${escapeHtml(m.status||"Scheduled")}<button class="secondary-btn" style="margin-left:10px" onclick="openMeetingForm('${m.id}')">Edit</button><button class="secondary-btn" style="margin-left:8px;color:#dc2626" onclick="deleteMeeting('${m.id}')">Delete</button></div></div>`).join(""):'<div class="muted">No meetings found.</div>'}
window.deleteMeeting=async function(id){if(!confirm("Delete this meeting?"))return;const{error}=await db.from("meetings").delete().eq("id",id).eq("company_id",currentCompany.id);if(error){alert(error.message);return;}await loadMeetings()};

let c1pxReminderItems=[];
function c1pxDateState(dateValue){if(!dateValue)return "Upcoming";const d=new Date(String(dateValue).slice(0,10)+"T00:00:00");const now=new Date();const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());if(d<today)return "Overdue";if(d.getTime()===today.getTime())return "Today";return "Upcoming"}
async function loadC1PXReminders(){if(!currentCompany)await loadCompany();if(!currentCompany)return;const items=[];const pull=async(table,type,dateKeys)=>{const{data,error}=await db.from(table).select("*").eq("company_id",currentCompany.id);if(error){console.error(`C1PX ${table} reminder load error:`,error);return;}for(const r of data||[]){let date=null;for(const k of dateKeys){if(r[k]){date=r[k];break}}if(!date)continue;items.push({id:r.id,type,title:r.title||r.customer_name||r.lead_name||`${type} reminder`,date,time:r.time||r.visit_time||r.meeting_time||null,assignee:r.assigned_employee||r.employee||r.assigned_to||null,notes:r.notes||r.message||"",state:c1pxDateState(date),sourceTable:table})}};await pull("followups","Follow-up",["follow_up_date","date","followup_date"]);await pull("site_visits","Site Visit",["visit_date","date"]);await pull("tasks","Task",["due_date"]);await pull("meetings","Meeting",["meeting_date"]);c1pxReminderItems=items.sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.time||"").localeCompare(String(b.time||"")));renderC1PXReminders()}
function renderC1PXReminders(){const el=document.getElementById("reminderRows");if(!el)return;const q=(document.getElementById("reminderSearch")?.value||"").toLowerCase(),tf=document.getElementById("reminderTypeFilter")?.value||"All",sf=document.getElementById("reminderStateFilter")?.value||"All";const rows=c1pxReminderItems.filter(r=>(tf==="All"||r.type===tf)&&(sf==="All"||r.state===sf)&&[r.title,r.assignee,r.notes,r.type].some(v=>String(v||"").toLowerCase().includes(q)));if(!rows.length){el.innerHTML='<div class="muted">No reminders found.</div>';return}el.innerHTML=rows.map(r=>`<div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><strong>${escapeHtml(r.title)}</strong><span>${escapeHtml(r.state)}</span></div><div class="muted">${escapeHtml(r.type)} · ${escapeHtml(r.date)} ${r.time?escapeHtml(formatTime(r.time)):''} · ${escapeHtml(r.assignee||'Unassigned')}</div>${r.notes?`<div style="margin-top:7px">${escapeHtml(r.notes)}</div>`:''}</div>`).join("")}

async function syncC1PXNotifications() {
    if (!currentCompany) return;

    const now = new Date();

    // IMPORTANT: use the browser's local calendar date here.
    // toISOString() converts to UTC and can move the date backward in India
    // (e.g. 00:30 IST becomes the previous UTC date), causing tomorrow's
    // meetings/follow-ups to be incorrectly skipped.
    const localYmd = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const ymd = localYmd(now);
    const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const tomorrowYmd = localYmd(tomorrowDate);

    const pending = [];

    const add = (sourceKey, title, message, type, employeeId = null) => {
        pending.push({
            company_id: currentCompany.id,
            employee_id: employeeId,
            title,
            message,
            type,
            source_key: sourceKey
        });
    };

    const employeeIdByName = (name) => {
        if (!name) return null;
        const e = companyEmployees.find(x =>
            String(x.name || '').trim().toLowerCase() === String(name).trim().toLowerCase()
        );
        return e ? e.id : null;
    };

    const addDueRows = (rows, type, dateField, titleGetter, employeeField, statusField) => {
        for (const r of rows || []) {
            const date = r[dateField] || null;
            if (!date) continue;
            const d = String(date).slice(0, 10);
            if (d > tomorrowYmd) continue;

            const status = statusField ? String(r[statusField] || '') : '';
            if (/completed|cancelled|done/i.test(status)) continue;

            const employeeName = r[employeeField] || r.assigned_employee || r.employee || null;
            const employeeId = employeeIdByName(employeeName);
            const when = d < ymd ? 'Overdue' : d === ymd ? 'Due today' : 'Due tomorrow';
            const title = titleGetter(r) || `${type} reminder`;

            add(
                `${type.toLowerCase().replace(/\s+/g, '_')}:${r.id}:${d}`,
                `${when}: ${title}`,
                `${type} for ${title} is ${when.toLowerCase()}.`,
                type.toLowerCase().replace(/\s+/g, '_'),
                employeeId
            );
        }
    };

    // Follow-ups do not have company_id in the current schema.
    // Resolve company-owned leads first, then load their follow-ups by lead_id.
    // This avoids relying on PostgREST nested-join/RLS behavior and ensures a
    // newly-created follow-up is detected immediately after Refresh.
    const { data: companyLeadRows, error: companyLeadError } = await db
        .from('leads')
        .select('id,name,assigned_employee')
        .eq('company_id', currentCompany.id);

    if (companyLeadError) {
        console.error('C1PX notification company leads load error:', companyLeadError);
    } else {
        const leadIds = (companyLeadRows || []).map(l => l.id).filter(Boolean);
        if (leadIds.length) {
            const leadById = new Map((companyLeadRows || []).map(l => [String(l.id), l]));
            const { data: followupRows, error: followupError } = await db
                .from('followups')
                .select('id,follow_up_date,follow_up_time,status,notes,lead_id')
                .in('lead_id', leadIds);

            if (followupError) {
                console.error('C1PX notification followups load error:', followupError);
            } else {
                for (const r of followupRows || []) {
                    const lead = leadById.get(String(r.lead_id));
                    const d = r.follow_up_date ? String(r.follow_up_date).slice(0, 10) : null;
                    if (!d || d > tomorrowYmd) continue;
                    if (/completed|cancelled|done/i.test(String(r.status || ''))) continue;

                    const employeeId = employeeIdByName(lead?.assigned_employee);
                    const when = d < ymd ? 'Overdue' : d === ymd ? 'Due today' : 'Due tomorrow';
                    const title = lead?.name || 'Lead follow-up';

                    add(
                        `follow-up:${r.id}:${d}`,
                        `${when}: ${title}`,
                        `Follow-up for ${title} is ${when.toLowerCase()}.`,
                        'follow_up',
                        employeeId
                    );
                }
            }
        }
    }

    // Tables below already carry company_id in the C1PX schema.
    const pull = async (table, type, dateField, titleGetter, employeeField = 'assigned_employee', statusField = 'status') => {
        const { data, error } = await db
            .from(table)
            .select('*')
            .eq('company_id', currentCompany.id);
        if (error) {
            console.error(`C1PX notification ${table} load error:`, error);
            return;
        }
        addDueRows(data, type, dateField, titleGetter, employeeField, statusField);
    };

    // Site visits may come from older records where company_id was not populated.
    // Resolve company-owned leads first and include site visits linked by lead_id,
    // while also including newer records that have company_id.
    const { data: siteVisitCompanyRows, error: siteVisitCompanyError } = await db
        .from('site_visits')
        .select('*')
        .eq('company_id', currentCompany.id);

    if (siteVisitCompanyError) {
        console.error('C1PX notification site_visits company load error:', siteVisitCompanyError);
    }

    const companyLeadIdsForVisits = (companyLeadRows || []).map(l => l.id).filter(Boolean);
    let siteVisitLeadRows = [];
    if (companyLeadIdsForVisits.length) {
        const { data, error } = await db
            .from('site_visits')
            .select('*')
            .in('lead_id', companyLeadIdsForVisits);
        if (error) {
            console.error('C1PX notification site_visits lead load error:', error);
        } else {
            siteVisitLeadRows = data || [];
        }
    }

    const siteVisitRowsById = new Map();
    for (const row of [...(siteVisitCompanyRows || []), ...siteVisitLeadRows]) {
        if (row && row.id != null) siteVisitRowsById.set(String(row.id), row);
    }

    const visitLeadMap = new Map((companyLeadRows || []).map(l => [String(l.id), l]));
    const visitRows = Array.from(siteVisitRowsById.values());

    for (const r of visitRows) {
        const lead = visitLeadMap.get(String(r.lead_id));
        const d = r.visit_date ? String(r.visit_date).slice(0, 10) : null;
        if (!d || d > tomorrowYmd) continue;
        if (/completed|cancelled|done/i.test(String(r.status || ''))) continue;

        const employeeName = r.employee || r.assigned_to || r.assigned_employee || lead?.assigned_employee || null;
        const employeeId = employeeIdByName(employeeName);
        const when = d < ymd ? 'Overdue' : d === ymd ? 'Due today' : 'Due tomorrow';
        const title = r.customer_name || r.lead_name || lead?.name || 'Site visit';

        add(
            `site_visit:${r.id}:${d}`,
            `${when}: ${title}`,
            `Site visit for ${title} is ${when.toLowerCase()}.`,
            'site_visit',
            employeeId
        );
    }

    await pull('tasks', 'Task', 'due_date', r => r.title || r.task_name || 'Task');
    await pull('meetings', 'Meeting', 'meeting_date', r => r.title || r.customer_name || 'Meeting');

    // Today's birthdays from company-owned CRM leads.
    const { data: birthdayLeads, error: birthdayError } = await db
        .from('leads')
        .select('id,name,dob,assigned_employee')
        .eq('company_id', currentCompany.id);

    if (!birthdayError) {
        const monthDay = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        for (const lead of birthdayLeads || []) {
            if (!lead.dob || String(lead.dob).slice(5, 10) !== monthDay) continue;
            const employeeId = employeeIdByName(lead.assigned_employee);
            add(
                `birthday:${lead.id}:${ymd}`,
                `Birthday: ${lead.name || 'Customer'}`,
                `Today is ${lead.name || 'your customer'}'s birthday.`,
                'birthday',
                employeeId
            );
        }
    } else {
        console.error('C1PX notification birthday load error:', birthdayError);
    }

    if (!pending.length) return;

    // Prevent repeated identical alerts from the same company from being
    // generated when legacy/test records produce the same visible alert.
    const uniquePending = [];
    const seen = new Set();
    for (const item of pending) {
        const fingerprint = [
            item.company_id,
            item.type,
            item.title,
            item.message
        ].join('|');
        if (seen.has(fingerprint)) continue;
        seen.add(fingerprint);
        uniquePending.push(item);
    }

    const { error: upsertError } = await db
        .from('notifications')
        .upsert(uniquePending, {
            onConflict: 'company_id,source_key',
            ignoreDuplicates: true
        });

    if (upsertError) {
        console.error('C1PX notification sync error:', upsertError);
    }
}

async function loadNotifications() {
    if (!currentCompany) await loadCompany();
    if (!currentCompany) return;

    const el = document.getElementById('notificationRows');
    if (el) el.innerHTML = '<div class="muted">Refreshing notifications...</div>';

    await syncC1PXNotifications();
    console.log('C1PX notifications refreshed at:', new Date().toLocaleString());

    const { data, error } = await db
        .from('notifications')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('C1PX notifications load error:', error);
        if (el) {
            el.innerHTML = `<div style="padding:18px;border-radius:12px;background:#fee2e2;color:#991b1b;">Unable to load notifications.<br><small>${escapeHtml(error.message || '')}</small></div>`;
        }
        return;
    }

    // Hide legacy duplicate rows that have the same visible notification.
    const uniqueNotifications = [];
    const seenNotifications = new Set();
    for (const item of (data || [])) {
        const fingerprint = [
            item.company_id,
            item.type,
            item.title,
            item.message
        ].join('|');
        if (seenNotifications.has(fingerprint)) continue;
        seenNotifications.add(fingerprint);
        uniqueNotifications.push(item);
    }

    c1pxNotifications = uniqueNotifications;
    if (!el) return;

    el.innerHTML = c1pxNotifications.length
        ? c1pxNotifications.map(n => `
            <div
                style="padding:14px;border-bottom:1px solid #e5e7eb;${n.read_at ? 'opacity:.65' : ''};cursor:pointer"
                onclick="openNotification('${escapeAttr(n.id)}')"
                title="Open related CRM item"
            >
                <div style="display:flex;justify-content:space-between;gap:10px">
                    <strong>${escapeHtml(n.title || 'Notification')}</strong>
                    <span class="muted">${escapeHtml(n.created_at || '')}</span>
                </div>
                <div class="muted" style="margin-top:5px">${escapeHtml(n.message || '')}</div>
                <div style="margin-top:9px;font-size:12px;color:#2563eb;font-weight:600">Open related item →</div>
                ${!n.read_at ? `<button class="secondary-btn" style="margin-top:8px" onclick="event.stopPropagation();markNotificationRead('${escapeAttr(n.id)}')">Mark read</button>` : ''}
            </div>
        `).join('')
        : '<div class="muted">No notifications.</div>';
}

window.openNotification = async function(notificationId) {
    if (!currentCompany) await loadCompany();
    const n = c1pxNotifications.find(x => String(x.id) === String(notificationId));
    if (!n) return;

    // Mark as read when opened.
    if (!n.read_at) {
        await db.from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('id', n.id)
            .eq('company_id', currentCompany.id);
        n.read_at = new Date().toISOString();
    }

    const key = String(n.source_key || '');
    const parts = key.split(':');
    const type = String(n.type || '').toLowerCase();
    const id = parts.length > 1 ? parts[1] : null;

    if (type === 'follow_up' || key.startsWith('follow-up:')) {
        if (!id) return;
        loadPage('followups');
        setTimeout(() => {
            if (typeof window.editFollowup === 'function') window.editFollowup(id);
        }, 150);
        return;
    }

    if (type === 'site_visit' || key.startsWith('site_visit:')) {
        if (!id) return;
        loadPage('visits');
        setTimeout(() => {
            if (typeof window.editSiteVisit === 'function') window.editSiteVisit(id);
        }, 150);
        return;
    }

    if (type === 'meeting' || key.startsWith('meeting:')) {
        if (!id) return;
        loadPage('meetings');
        setTimeout(() => {
            if (typeof window.openMeetingForm === 'function') window.openMeetingForm(id);
        }, 150);
        return;
    }

    if (type === 'task' || key.startsWith('task:')) {
        if (!id) return;
        loadPage('tasks');
        setTimeout(() => {
            if (typeof window.openTaskForm === 'function') window.openTaskForm(id);
        }, 150);
        return;
    }

    if (type === 'birthday' || key.startsWith('birthday:')) {
        if (!id) return;
        loadPage('leads');
        setTimeout(() => {
            if (typeof window.viewLead === 'function') window.viewLead(id);
        }, 150);
        return;
    }
};

window.refreshNotifications = async function () {
    const el = document.getElementById('notificationRows');
    const button = document.getElementById('refreshNotificationsButton');

    if (el) el.innerHTML = '<div class="muted">Refreshing notifications...</div>';
    if (button) {
        button.disabled = true;
        button.textContent = 'Refreshing...';
    }

    try {
        await loadNotifications();
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = 'Refresh';
        }
    }
};

window.markNotificationRead = async function(id) {
    if (!currentCompany) return;
    const { error } = await db
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id)
        .eq('company_id', currentCompany.id);
    if (error) {
        alert(error.message);
        return;
    }
    await loadNotifications();
};
// =====================================
// EMPLOYEES MODULE
// =====================================

function employeesHTML() {

    return `
        <div class="section-head">
            <div>
                <span class="eyebrow">TEAM</span>
                <h2>Employees</h2>
                <p>Manage your company team members and access.</p>
            </div>

            <button class="primary-btn" onclick="openAddEmployeeModal()">
                + Add Employee
            </button>
        </div>

        <div class="card" style="padding:0; overflow:hidden;">

            <div style="
                padding:18px;
                border-bottom:1px solid #e5e7eb;
                font-weight:700;
            ">
                Team Members
            </div>

            <div style="overflow-x:auto;">

                <table style="
                    width:100%;
                    border-collapse:collapse;
                ">

                    <thead>
                        <tr>
                            <th style="padding:14px;text-align:left;">Employee</th>
                            <th style="padding:14px;text-align:left;">Role</th>
                            <th style="padding:14px;text-align:left;">Status</th>
                            <th style="padding:14px;text-align:left;">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${companyEmployees.map((employee) => {
            const protectedOwner = isC1PXOwner(employee);
            return `
    <tr style="border-top:1px solid #e5e7eb;">

        <td style="padding:14px;">
            <strong>${escapeHtml(employee.name || "Unnamed")}</strong>
            ${protectedOwner ? `<div style="margin-top:5px;"><span style="display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:#eef2ff;color:#3730a3;font-size:11px;font-weight:700;">🔒 Protected Owner</span></div>` : ""}
        </td>

        <td style="padding:14px;">
            ${escapeHtml(employee.role || "Employee")}
        </td>

        <td style="padding:14px;">
            <span style="
                padding:5px 10px;
                border-radius:20px;
                background:${employee.active ? "#dcfce7" : "#fee2e2"};
                color:${employee.active ? "#166534" : "#991b1b"};
                font-size:12px;
                font-weight:600;
            ">
                ${employee.active ? "Active" : "Inactive"}
            </span>
        </td>

        <td style="padding:14px;">
            ${
                protectedOwner
                ? `<span style="font-size:13px;color:#4b5563;font-weight:600;">Owner login protected — email/password cannot be changed or deleted.</span>`
                : `
                    <button
                        class="secondary-btn"
                        onclick="createEmployeeLogin(${employee.id})"
                        style="margin-right:6px;"
                    >
                        ${employee.login_enabled ? "Login Active" : "Create Login"}
                    </button>

                    ${
                        employee.login_enabled && employee.auth_user_id
                        ? `
                        <button
                            class="secondary-btn"
                            onclick="resetEmployeePassword(${employee.id})"
                            title="Set a new password for this login account"
                            style="margin-right:6px;"
                        >
                            Reset Password
                        </button>
                        `
                        : ""
                    }

                    ${
                        employee.login_enabled
                        ? `
                            <button class="secondary-btn" onclick="toggleEmployeeLogin(${employee.id})" style="margin-right:6px;">
                                Disable Login
                            </button>
                        `
                        : `
                            <button class="secondary-btn" onclick="toggleEmployeeLogin(${employee.id})" style="margin-right:6px;">
                                Enable Login
                            </button>
                        `
                    }

                    <button class="secondary-btn" onclick="editEmployee(${employee.id})" style="margin-right:6px;">
                        Edit
                    </button>

                    <button class="secondary-btn" onclick="deleteEmployee(${employee.id})" style="color:#dc2626;">
                        Delete
                    </button>
                `
            }
        </td>

    </tr>
`;
        }).join("")}

                    </tbody>

                </table>

            </div>
        </div>
    `;
}


// =====================================
// ADD EMPLOYEE
// =====================================

function openAddEmployeeModal() {

    const modal = document.createElement("div");

    modal.id = "employeeModal";

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.5);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:9999;
            padding:20px;
        ">

            <div style="
                background:white;
                width:100%;
                max-width:520px;
                border-radius:16px;
                padding:24px;
                box-shadow:0 20px 50px rgba(0,0,0,.2);
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:20px;
                ">
                    <div>
                        <h2 style="margin:0;">Add Employee</h2>
                        <small style="color:#6b7280;">
                            Add a team member to your company.
                        </small>
                    </div>

                    <button
                        onclick="document.getElementById('employeeModal')?.remove()"
                        style="
                            border:0;
                            background:none;
                            font-size:22px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>
                </div>

                <div style="
                    display:grid;
                    gap:15px;
                ">

                    <label>
                        Full Name
                        <input
                            id="newEmployeeName"
                            type="text"
                            placeholder="Employee name"
                        >
                    </label>

                    <label>
                        Phone
                        <input
                            id="newEmployeePhone"
                            type="text"
                            placeholder="Phone number"
                        >
                    </label>

                    <label>
                        Email
                        <input
                            id="newEmployeeEmail"
                            type="email"
                            placeholder="employee@email.com"
                        >
                    </label>

                    <label>
                        Role
                        <select id="newEmployeeRole">
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </label>

                </div>

                <div style="
                    display:flex;
                    justify-content:flex-end;
                    gap:10px;
                    margin-top:22px;
                ">

                    <button
                        class="secondary-btn"
                        onclick="document.getElementById('employeeModal')?.remove()"
                    >
                        Cancel
                    </button>

                    <button
                        class="primary-btn"
                        onclick="saveNewEmployee()"
                    >
                        Save Employee
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);
}

// =====================================
// SAVE NEW EMPLOYEE
// =====================================

async function saveNewEmployee() {

    if (!currentCompany) {
    await loadCompany();
}

if (!currentCompany) {
    alert("❌ Company data could not be loaded. Please refresh the page.");
    return;
}

    const name = document.getElementById("newEmployeeName").value.trim();
    const phone = document.getElementById("newEmployeePhone").value.trim();
    const email = document.getElementById("newEmployeeEmail").value.trim();
    const role = document.getElementById("newEmployeeRole").value;

    if (!name) {
        alert("Please enter employee name.");
        return;
    }

    const newEmployee = {
        name: name,
        phone: phone || null,
        email: email || null,
        role: role || "Employee",
        active: true,
        company_id: currentCompany.id
    };

    const { data, error } = await db
        .from("employees")
        .insert([newEmployee])
        .select()
        .single();

    if (error) {
        console.error("Employee save error:", error);
        alert("❌ Failed to save employee.");
        return;
    }

    console.log("C1PX Employee Saved:", data);

    alert("✅ Employee added successfully!");

    document.getElementById("employeeModal")?.remove();

    await loadEmployees();

    loadPage("employees");
}

// =====================================================
// C1PX - PROPERTY PHASES
// =====================================================

let propertyPhases = [];

async function loadPropertyPhases() {

    if (!currentCompany) {
        await loadCompany();
    }

    if (!currentCompany) {
        console.error("❌ Company not loaded.");
        return;
    }

   const { data, error } = await db
    .from("property_phases")
    .select("*")
    .eq("company_id", currentCompany.id)
    .order("created_at", { ascending: true });

    if (error) {
        console.error("❌ Property phases loading error:", error);
        return;
    }

    propertyPhases = data || [];

    console.log("C1PX Property Phases:", propertyPhases);
}

function hasC1PXPermission(permission) {
    if (!window.currentEmployee) return false;

    // Admin always has full access.
    if (isC1PXAdminOrOwner(window.currentEmployee)) return true;

    const rolePermissions =
        window.currentEmployee.roles?.permissions ||
        {};

    return rolePermissions.all === true ||
        rolePermissions[permission] === true;
}

function canViewProperties() {
    return hasC1PXPermission("properties") ||
        hasC1PXPermission("property_view") ||
        hasC1PXPermission("property_edit");
}

function canEditPropertyPlot() {
    return hasC1PXPermission("property_edit");
}

function propertiesHTML() {

    // Group phases by project
    const groupedProjects = {};

    propertyPhases.forEach(phase => {

        const projectName =
            (phase.project_name || "Unnamed Project").trim();

        if (!groupedProjects[projectName]) {
            groupedProjects[projectName] = [];
        }

        groupedProjects[projectName].push(phase);
    });

    const projectNames =
        Object.keys(groupedProjects);

    return `
        <div class="page-toolbar">

            <div>
                <span class="eyebrow">
                    PROPERTY INVENTORY
                </span>

                <h3>
                    Properties
                </h3>

                <p class="muted">
                    Manage projects, phases, plots, availability, holds, pipeline and site visits.
                </p>
            </div>

            <button
                class="primary-btn"
                onclick="openAddPhaseModal()"
            >
                + Add Phase
            </button>

        </div>


        ${
            projectNames.length === 0

                ? `
                    <section class="panel">

                        <div style="
                            padding:30px;
                            text-align:center;
                            color:#6b7280;
                        ">
                            No property phases added yet.
                        </div>

                    </section>
                `

                :

                projectNames.map(projectName => {

                    const phases =
                        groupedProjects[projectName];

                    const totalPlots =
                        phases.reduce(
                            (total, phase) =>
                                total +
                                Number(
                                    phase.total_plots || 0
                                ),
                            0
                        );

                    return `

                        <section
                            class="panel"
                            style="margin-bottom:18px;"
                        >

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                                gap:15px;
                                flex-wrap:wrap;
                            ">

                                <div>

                                    <h3 style="
                                        margin:0;
                                    ">
                                        ${projectName}
                                    </h3>

                                    <p
                                        class="muted"
                                        style="
                                            margin:5px 0 0;
                                        "
                                    >
                                        Project Inventory
                                    </p>

                                </div>


                                <div style="
                                    font-size:14px;
                                    font-weight:600;
                                ">

                                    Total Project Plots:

                                    <span style="
                                        font-size:20px;
                                    ">
                                        ${totalPlots}
                                    </span>

                                </div>

                            </div>


                            <div style="
                                display:grid;
                                grid-template-columns:
                                    repeat(
                                        auto-fit,
                                        minmax(220px,1fr)
                                    );
                                gap:14px;
                                margin-top:18px;
                            ">

                                ${
                                    phases.map(phase => {

                                        const status =
                                            phase.status ||
                                            "Coming Soon";

                                        let statusColor =
                                            "#b45309";

                                        if (
                                            status ===
                                            "Selling Now"
                                        ) {
                                            statusColor =
                                                "#15803d";
                                        }

                                        if (
                                            status ===
                                            "Completed"
                                        ) {
                                            statusColor =
                                                "#64748b";
                                        }

                                        return `

                                            <div style="
                                                padding:18px;
                                                border:1px solid #e5e7eb;
                                                border-radius:14px;
                                                position:relative;
                                            ">

                                                <div style="
                                                    font-size:13px;
                                                    color:#6b7280;
                                                    text-transform:uppercase;
                                                ">
                                                    ${
                                                        phase.phase_name ||
                                                        "Unnamed Phase"
                                                    }
                                                </div>


                                                <div style="
                                                    font-size:25px;
                                                    font-weight:700;
                                                    margin:5px 0;
                                                ">
                                                    ${
                                                        Number(
                                                            phase.total_plots ||
                                                            0
                                                        )
                                                    }
                                                    Plots
                                                </div>


                                                <span style="
                                                    color:${statusColor};
                                                    font-weight:600;
                                                ">
                                                    ${status}
                                                </span>


                                                ${
                                                    canViewProperties()
                                                        ? `
                                                            <div style="
                                                                display:flex;
                                                                gap:8px;
                                                                margin-top:14px;
                                                                flex-wrap:wrap;
                                                            ">
                                                                <button
                                                                    class="secondary-btn"
                                                                    onclick="openPropertyPlots(
                                                                        '${projectName}',
                                                                        '${phase.phase_name}',
                                                                        '${phase.id}'
                                                                    )"
                                                                    style="padding:8px 12px;font-size:13px;"
                                                                >
                                                                    View Plots
                                                                </button>

                                                                ${
                                                                    currentEmployee && currentEmployee.role === "Admin"
                                                                        ? `
                                                                            <button
                                                                                class="secondary-btn"
                                                                                onclick="editPropertyPhase('${phase.id}')"
                                                                                style="padding:8px 12px;font-size:13px;"
                                                                            >
                                                                                Edit Phase
                                                                            </button>
                                                                            <button
                                                                                class="secondary-btn"
                                                                                onclick="deletePropertyPhase('${phase.id}')"
                                                                                style="padding:8px 12px;font-size:13px;color:#b91c1c;border-color:#fecaca;"
                                                                            >
                                                                                Delete Phase
                                                                            </button>
                                                                        `
                                                                        : ""
                                                                }
                                                            </div>
                                                        `
                                                        : ""
                                                }

                                            </div>

                                        `;

                                    }).join("")
                                }

                            </div>

                        </section>

                    `;

                }).join("")
        }

    `;
}

window.saveEditedPropertyPhase = async function (phaseId) {

    const phase = propertyPhases.find(
        p => String(p.id) === String(phaseId)
    );

    if (!phase) {
        alert("Phase not found.");
        return;
    }

    const phaseName =
        document.getElementById("editPhaseName").value.trim();

    const totalPlots =
        Number(
            document.getElementById("editPhasePlots").value
        );

    const status =
        document.getElementById("editPhaseStatus").value;

    const message =
        document.getElementById("editPhaseMessage");

    const button =
        document.getElementById("saveEditedPhaseButton");

    if (!phaseName) {
        if (message) {
            message.textContent =
                "Please enter phase name.";
        }
        return;
    }

    if (!totalPlots || totalPlots < 1) {
        if (message) {
            message.textContent =
                "Please enter a valid number of plots.";
        }
        return;
    }

    button.disabled = true;
    button.textContent = "Saving...";

    try {

        const { data, error } = await db
            .from("property_phases")
            .update({
                phase_name: phaseName,
                total_plots: totalPlots,
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq("id", phaseId)
            .eq("company_id", currentCompany.id)
            .select()
            .single();

        if (error) {
            console.error(
                "C1PX Edit Phase Error:",
                error
            );

            throw new Error(error.message);
        }

        console.log(
            "C1PX Phase Updated:",
            data
        );

        // Update local array immediately
        const index = propertyPhases.findIndex(
            p => String(p.id) === String(phaseId)
        );

        if (index !== -1) {
            propertyPhases[index] = data;
        }

        closeEditPhaseModal();

        // Refresh Properties immediately
        appContent.innerHTML = propertiesHTML();
        bindPageEvents();

        alert(
            "✅ Phase updated successfully!"
        );

    } catch (error) {

        console.error(
            "C1PX Save Edited Phase Error:",
            error
        );

        if (message) {
            message.textContent =
                error.message ||
                "Failed to update phase.";
        }

    } finally {

        button.disabled = false;
        button.textContent = "Save Changes";
    }
};

window.scheduleVisitFromVisits = function () {

  if (!leads || !leads.length) {
    alert("❌ No leads available. Please add a lead first.");
    return;
  }

  const leadList = leads.map((lead, index) =>
    `${index + 1}. ${lead.name} - ${lead.phone || "No phone"}`
  ).join("\n");

  const choice = prompt(
    "SELECT CUSTOMER / LEAD\n\n" +
    leadList +
    "\n\nEnter the number of the customer:"
  );

  if (!choice) return;

  const index = parseInt(choice, 10) - 1;

  if (isNaN(index) || index < 0 || index >= leads.length) {
    alert("❌ Invalid customer selection.");
    return;
  }

  const selectedLead = leads[index];

  scheduleVisit(selectedLead.id);
};

// ========================================
// SITE VISITS MODULE
// ========================================

function renderSiteVisitRows() {

    const container =
        document.getElementById("siteVisitRowsContainer");

    if (!container) {
        console.error("❌ siteVisitRowsContainer NOT FOUND");
        return;
    }

    container.innerHTML = `
        <tr>
            <td colspan="8" class="table-loading">
                ⏳ Loading site visits...
            </td>
        </tr>
    `;

    db
        .from("site_visits")
        .select("*")
        .order("visit_date", { ascending: true })
        .then(async ({ data, error }) => {

            console.log("C1PX Site Visits:", data);
            console.log("C1PX Site Visit Error:", error);

            if (error) {

                container.innerHTML = `
                    <tr>
                        <td colspan="8" class="table-loading">
                            ❌ Failed to load site visits.
                            <br>
                            <small>${error.message}</small>
                        </td>
                    </tr>
                `;

                return;
            }

            if (!data || data.length === 0) {

                container.innerHTML = `
                    <tr>
                        <td colspan="8" class="table-loading">
                            📅 No site visits scheduled yet.
                        </td>
                    </tr>
                `;

                return;
            }

            const rows = data.map(visit => {

                const lead = leads.find(
                    l => String(l.id) === String(visit.lead_id)
                );

                const customerName =
                    lead?.name ||
                    visit.customer_name ||
                    "Unknown Customer";

                const phone =
                    lead?.phone ||
                    visit.phone ||
                    "";

                const project =
                    lead?.project ||
                    visit.project ||
                    "-";

                const visitDate =
                    visit.visit_date || "-";

                const visitTime =
                    visit.visit_time || "-";

                const employee =
                    visit.employee ||
                    visit.assigned_to ||
                    "Not Assigned";

                const status =
                    visit.status ||
                    "Scheduled";

                const notes =
                    visit.notes ||
                    "-";

                return `
                    <tr class="site-visit-table-row">

                        <td>
                            <div class="visit-customer">
                                <strong>
                                    ${customerName}
                                </strong>

                                <span>
                                    ${phone || "No phone"}
                                </span>
                            </div>
                        </td>

                        <td>
                            <strong>
                                ${project}
                            </strong>
                        </td>

                        <td>
                            ${visitDate}
                        </td>

                        <td>
                            ${visitTime}
                        </td>

                        <td>
                            ${employee}
                        </td>

                        <td>
                            <span class="visit-status ${String(status)
                                .toLowerCase()
                                .replace(/\s+/g, "-")}">
                                ${status}
                            </span>
                        </td>

                        <td>
    <span class="visit-notes">
        ${notes}
    </span>
</td>

<td>
    <button
        class="secondary-btn"
        onclick="editSiteVisit('${visit.id}')"
        style="padding:7px 12px;"
    >
        Edit
    </button>
</td>

                    </tr>
                `;
            }).join("");

            container.innerHTML = rows;

        })
        .catch(error => {

            console.error(
                "❌ SITE VISITS EXCEPTION:",
                error
            );

            container.innerHTML = `
                <tr>
                    <td colspan="8" class="table-loading">
                        ❌ Failed to load site visits.
                        <br>
                        <small>${error.message}</small>
                    </td>
                </tr>
            `;
        });
}


// ==========================================
// SITE VISITS PAGE UI
// ==========================================

function siteVisitsHTML() {
    return `
        <div class="page-toolbar">
            <div>
                <span class="eyebrow">PROPERTY SITE VISITS</span>
                <h3>Site Visits</h3>
                <p class="muted">Schedule and manage customer property site visits.</p>
            </div>

            <button class="primary-btn" onclick="scheduleVisitFromVisits()">
                + Schedule Visit
            </button>
        </div>

        <section class="panel site-visits-panel">
            <div class="site-visits-table-wrapper">
                <table class="site-visits-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Project</th>
                            <th>Visit Date</th>
                            <th>Time</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody id="siteVisitRowsContainer">
                        <tr>
                            <td colspan="8" class="table-loading">
                                Loading site visits...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;
}

// ==========================================
// FOLLOW-UPS MODULE
// ==========================================

function followupsHTML() {
  return `
    <div class="page-toolbar">
      <div>
        <span class="eyebrow">CUSTOMER FOLLOW-UP</span>
        <h3>Follow-ups</h3>
        <p class="muted">Manage today's and upcoming customer follow-ups.</p>
      </div>

      <button class="primary-btn" onclick="openFollowupForm()">
        + Add Follow-up
      </button>
    </div>

    <section class="panel" style="margin-bottom:18px;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;">

        <div style="padding:16px;border-radius:12px;background:#f3f4f6;">
          <div style="font-size:13px;color:#6b7280;">TOTAL</div>
          <strong id="followupTotal" style="font-size:26px;">0</strong>
        </div>

        <div style="padding:16px;border-radius:12px;background:#fef3c7;">
          <div style="font-size:13px;color:#92400e;">PENDING</div>
          <strong id="followupPending" style="font-size:26px;">0</strong>
        </div>

        <div style="padding:16px;border-radius:12px;background:#dcfce7;">
          <div style="font-size:13px;color:#166534;">COMPLETED</div>
          <strong id="followupCompleted" style="font-size:26px;">0</strong>
        </div>

        <div style="padding:16px;border-radius:12px;background:#fee2e2;">
          <div style="font-size:13px;color:#991b1b;">OVERDUE</div>
          <strong id="followupOverdue" style="font-size:26px;">0</strong>
        </div>

      </div>
    </section>

    <section class="panel">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
        <div>
          <span class="eyebrow">FOLLOW-UP LIST</span>
          <h3 style="margin:4px 0;">Customer Follow-ups</h3>
        </div>

        <select id="followupStatusFilter"
                onchange="renderFollowupRows()"
                style="padding:10px 14px;border:1px solid #d1d5db;border-radius:9px;">
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div id="followupRowsContainer" style="margin-top:18px;">
        <div class="muted">Loading follow-ups...</div>
      </div>
    </section>

    <div id="followupModal" style="
      display:none;
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.45);
      z-index:9999;
      align-items:center;
      justify-content:center;
      padding:20px;
    ">
      <div style="
        background:#fff;
        width:min(520px,100%);
        max-height:90vh;
        overflow:auto;
        border-radius:16px;
        padding:22px;
        box-shadow:0 20px 60px rgba(0,0,0,.2);
      ">

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
          <div>
            <span class="eyebrow">CUSTOMER FOLLOW-UP</span>
            <h3 style="margin:4px 0;">Add Follow-up</h3>
          </div>

          <button onclick="closeFollowupForm()"
                  style="border:0;background:#f3f4f6;border-radius:9px;padding:8px 12px;cursor:pointer;">
            ✕
          </button>
        </div>

        <div style="display:grid;gap:14px;">

          <div>
            <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;">
              Lead *
            </label>

            <select id="followupLead"
                    style="width:100%;padding:11px;border:1px solid #d1d5db;border-radius:9px;">
              <option value="">Loading leads...</option>
            </select>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">

            <div>
              <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;">
                Date *
              </label>

              <input id="followupDate"
                     type="date"
                     style="width:100%;padding:11px;border:1px solid #d1d5db;border-radius:9px;">
            </div>

            <div>
              <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;">
                Time
              </label>

              <input id="followupTime"
                     type="time"
                     style="width:100%;padding:11px;border:1px solid #d1d5db;border-radius:9px;">
            </div>

          </div>

          <div>
            <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;">
              Status
            </label>

            <select id="followupStatus"
                    style="width:100%;padding:11px;border:1px solid #d1d5db;border-radius:9px;">
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;">
              Notes
            </label>

            <textarea id="followupNotes"
                      rows="4"
                      placeholder="Enter follow-up notes..."
                      style="width:100%;padding:11px;border:1px solid #d1d5db;border-radius:9px;resize:vertical;"></textarea>
          </div>

          <button class="primary-btn"
                  onclick="saveFollowup()"
                  style="width:100%;">
            Save Follow-up
          </button>

        </div>
      </div>
    </div>
  `;
}


// ==========================================
// LOAD FOLLOW-UPS
// ==========================================

async function renderFollowupRows() {

  const container = document.getElementById("followupRowsContainer");

  if (!container) return;

  container.innerHTML = `
    <div class="muted">Loading follow-ups...</div>
  `;

  const { data, error } = await db
    .from("followups")
    .select(`
      id,
      lead_id,
      follow_up_date,
      follow_up_time,
      status,
      notes,
      created_at,
      leads (
        id,
        name,
        phone
      )
    `)
    .order("follow_up_date", { ascending: true })
    .order("follow_up_time", { ascending: true });

  if (error) {
    console.error("Follow-ups load error:", error);

    container.innerHTML = `
      <div style="padding:18px;border-radius:12px;background:#fee2e2;color:#991b1b;">
        Unable to load follow-ups.<br>
        <small>${error.message}</small>
      </div>
    `;

    return;
  }

  const followups = data || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const processed = followups.map(item => {

    const date = item.follow_up_date
      ? new Date(item.follow_up_date + "T00:00:00")
      : null;

    const isOverdue =
      item.status !== "Completed" &&
      date &&
      date < today;

    return {
      ...item,
      displayStatus: isOverdue ? "Overdue" : (item.status || "Pending")
    };
  });

  const filter =
    document.getElementById("followupStatusFilter")?.value || "All";

  const filtered = filter === "All"
    ? processed
    : processed.filter(item => item.displayStatus === filter);

  const total = processed.length;

  const pending = processed.filter(
    item => item.displayStatus === "Pending"
  ).length;

  const completed = processed.filter(
    item => item.displayStatus === "Completed"
  ).length;

  const overdue = processed.filter(
    item => item.displayStatus === "Overdue"
  ).length;

  const totalEl = document.getElementById("followupTotal");
  const pendingEl = document.getElementById("followupPending");
  const completedEl = document.getElementById("followupCompleted");
  const overdueEl = document.getElementById("followupOverdue");

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (completedEl) completedEl.textContent = completed;
  if (overdueEl) overdueEl.textContent = overdue;

  if (!filtered.length) {
    container.innerHTML = `
      <div style="padding:30px;text-align:center;">
        <div style="font-size:35px;margin-bottom:10px;">📅</div>
        <h3>No follow-ups found</h3>
        <p class="muted">
          Add a follow-up to start managing customer callbacks.
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML = filtered.map(item => {

    const lead = item.leads || {};

    const status = item.displayStatus;

    let statusStyle = "";

    if (status === "Completed") {
      statusStyle = "background:#dcfce7;color:#166534;";
    } else if (status === "Overdue") {
      statusStyle = "background:#fee2e2;color:#991b1b;";
    } else {
      statusStyle = "background:#fef3c7;color:#92400e;";
    }

    const dateText = item.follow_up_date
      ? new Date(item.follow_up_date + "T00:00:00").toLocaleDateString("en-IN")
      : "—";

    const timeText = item.follow_up_time
      ? item.follow_up_time.slice(0,5)
      : "—";

    return `
      <div style="
        border:1px solid #e5e7eb;
        border-radius:14px;
        padding:16px;
        margin-bottom:12px;
      ">

        <div style="
          display:flex;
          justify-content:space-between;
          gap:12px;
          align-items:flex-start;
          flex-wrap:wrap;
        ">

          <div>
            <div style="font-size:17px;font-weight:700;">
              ${escapeHtml(lead.name || "Unknown Lead")}
            </div>

            <div class="muted" style="margin-top:4px;">
              ${escapeHtml(lead.phone || "No phone")}
            </div>
          </div>

          <span style="
            ${statusStyle}
            padding:6px 10px;
            border-radius:999px;
            font-size:12px;
            font-weight:700;
          ">
            ${status}
          </span>

        </div>

        <div style="
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
          gap:10px;
          margin-top:14px;
        ">

          <div>
            <div class="muted" style="font-size:12px;">DATE</div>
            <strong>${dateText}</strong>
          </div>

          <div>
            <div class="muted" style="font-size:12px;">TIME</div>
            <strong>${timeText}</strong>
          </div>

        </div>

        ${
          item.notes
            ? `
              <div style="
                margin-top:14px;
                padding:11px;
                background:#f9fafb;
                border-radius:9px;
              ">
                <div class="muted" style="font-size:12px;">NOTES</div>
                <div style="margin-top:4px;">
                  ${escapeHtml(item.notes)}
                </div>
              </div>
            `
            : ""
        }

        <div style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:14px;
        ">

${
  status !== "Completed"
    ? `
      <button
        class="primary-btn"
        onclick="completeFollowup(${item.id})">
        ✓ Complete
      </button>
    `
    : ""
}

<button
  onclick="editFollowup(${item.id})"
  style="
    padding:9px 13px;
    border:1px solid #dbeafe;
    background:#fff;
    color:#2563eb;
    border-radius:9px;
    cursor:pointer;
  ">
  Edit
</button>

<button
  onclick="deleteFollowup(${item.id})"
  style="
    padding:9px 13px;
    border:1px solid #fecaca;
    background:#fff;
    color:#b91c1c;
    border-radius:9px;
    cursor:pointer;
  ">
  Delete
</button>

        </div>

      </div>
    `;
  }).join("");
}


// ==========================================
// OPEN FOLLOW-UP FORM
// ==========================================

async function openFollowupForm(editId = null) {

  const modal = document.getElementById("followupModal");

  if (!modal) return;

  modal.style.display = "flex";

  const leadSelect = document.getElementById("followupLead");

  if (!leadSelect) return;

  leadSelect.innerHTML = `
    <option value="">Loading leads...</option>
  `;

  const { data, error } = await db
    .from("leads")
    .select("id,name,phone")
    .eq("company_id", currentCompany.id)
    .order("name", { ascending: true });

  if (error) {

    console.error("Leads load error:", error);

    leadSelect.innerHTML = `
      <option value="">Unable to load leads</option>
    `;

    return;
  }

  if (!data || !data.length) {

    leadSelect.innerHTML = `
      <option value="">No leads available</option>
    `;

    return;
  }

  leadSelect.innerHTML = `
    <option value="">Select Lead</option>
    ${
      data.map(lead => `
        <option value="${lead.id}">
          ${escapeHtml(lead.name)}${lead.phone ? " — " + escapeHtml(lead.phone) : ""}
        </option>
      `).join("")
    }
  `;

  const dateInput = document.getElementById("followupDate");

  if (dateInput && !dateInput.value) {

    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
}


// ==========================================
// CLOSE FOLLOW-UP FORM
// ==========================================

function closeFollowupForm() {

  const modal = document.getElementById("followupModal");

  if (modal) {
    modal.style.display = "none";
  }
}


// ==========================================
// SAVE FOLLOW-UP
// ==========================================

async function saveFollowup() {

  const leadId =
    document.getElementById("followupLead")?.value;

  const date =
    document.getElementById("followupDate")?.value;

  const time =
    document.getElementById("followupTime")?.value || null;

  const status =
    document.getElementById("followupStatus")?.value || "Pending";

  const notes =
    document.getElementById("followupNotes")?.value.trim() || null;

  if (!leadId) {
    alert("Please select a lead.");
    return;
  }

  if (!date) {
    alert("Please select a follow-up date.");
    return;
  }

  const editId = window.editingFollowupId || null;

  let error;

  if (editId) {

    const result = await db
      .from("followups")
      .update({
        lead_id: Number(leadId),
        follow_up_date: date,
        follow_up_time: time,
        status: status,
        notes: notes
      })
      .eq("id", editId);

    error = result.error;

  } else {

    const result = await db
      .from("followups")
      .insert({
        lead_id: Number(leadId),
        follow_up_date: date,
        follow_up_time: time,
        status: status,
        notes: notes
      });

    error = result.error;
  }

  if (error) {

    console.error("Follow-up save error:", error);

    alert(
      "❌ Follow-up could not be saved:\n" +
      error.message
    );

    return;
  }

  alert(
    editId
      ? "✅ Follow-up updated successfully."
      : "✅ Follow-up saved successfully."
  );

  window.editingFollowupId = null;

  closeFollowupForm();

  renderFollowupRows();
}

async function editFollowup(id) {

  const { data, error } = await db
    .from("followups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {

    console.error("Follow-up load error:", error);

    alert(
      "❌ Follow-up could not be loaded:\n" +
      error.message
    );

    return;
  }

  window.editingFollowupId = id;

  await openFollowupForm();

  const leadInput =
    document.getElementById("followupLead");

  const dateInput =
    document.getElementById("followupDate");

  const timeInput =
    document.getElementById("followupTime");

  const statusInput =
    document.getElementById("followupStatus");

  const notesInput =
    document.getElementById("followupNotes");

  if (leadInput) {
    leadInput.value = String(data.lead_id);
  }

  if (dateInput) {
    dateInput.value = data.follow_up_date || "";
  }

  if (timeInput) {
    timeInput.value = data.follow_up_time || "";
  }

  if (statusInput) {
    statusInput.value = data.status || "Pending";
  }

  if (notesInput) {
    notesInput.value = data.notes || "";
  }
}


// ==========================================
// COMPLETE FOLLOW-UP
// ==========================================

async function completeFollowup(id) {

  const confirmed =
    confirm("Mark this follow-up as completed?");

  if (!confirmed) return;

  const { error } = await db
    .from("followups")
    .update({
      status: "Completed"
    })
    .eq("id", id);

  if (error) {

    console.error("Follow-up update error:", error);

    alert(
      "❌ Follow-up could not be updated:\n" +
      error.message
    );

    return;
  }

  renderFollowupRows();
}


// ==========================================
// DELETE FOLLOW-UP
// ==========================================

async function deleteFollowup(id) {

  const confirmed =
    confirm("Delete this follow-up permanently?");

  if (!confirmed) return;

  const { error } = await db
    .from("followups")
    .delete()
    .eq("id", id);

  if (error) {

    console.error("Follow-up delete error:", error);

    alert(
      "❌ Follow-up could not be deleted:\n" +
      error.message
    );

    return;
  }

  renderFollowupRows();
}

// =====================================================
// C1PX - GENERIC INDIVIDUAL PLOT SYSTEM
// =====================================================

function getAllPropertyPlots() {

    const plots = [];

    const addPlots = (project, phase, source) => {

        if (!Array.isArray(source)) return;

        source.forEach(plot => {

            plots.push({
                ...plot,
                project: project,
                phase: phase
            });

        });
    };

    addPlots(
        "Dayal Dev Park",
        "Phase 1",
        phase1Plots
    );

    addPlots(
        "Dayal Dev Park",
        "Phase 2",
        phase2Plots
    );

    addPlots(
        "Dayal Dev Park",
        "Phase 3",
        phase3Plots
    );

    addPlots(
        "Guru Dev Park",
        "Phase 1",
        guruDevParkPhase1Plots
    );

    return plots;
}


function findPropertyPlot(project, phase, plotNumber) {

    const key = `${project}|${phase}`;

    const sources = {
        "Dayal Dev Park|Phase 1": phase1Plots,
        "Dayal Dev Park|Phase 2": phase2Plots,
        "Dayal Dev Park|Phase 3": phase3Plots,
        "Guru Dev Park|Phase 1": guruDevParkPhase1Plots
    };

    const source = sources[key];

    if (!Array.isArray(source)) {
        return null;
    }

    return source.find(
        plot => Number(plot.plotNumber) === Number(plotNumber)
    ) || null;
}

window.openPropertyPlots = function (project, phase, phaseId) {

    const plots = getAllPropertyPlots().filter(plot =>
        plot.project === project &&
        plot.phase === phase
    );

    if (!plots.length) {
        alert(
            `No individual plot data found for ${project} • ${phase}.`
        );
        return;
    }

    appContent.innerHTML = `
        <div style="padding:24px;">

            <button
                class="secondary-btn"
                onclick="loadPage('properties')"
                style="margin-bottom:20px;"
            >
                ← Back to Properties
            </button>

            <div class="page-header">
                <div>
                    <span class="eyebrow">PROPERTY INVENTORY</span>

                    <h2 style="margin:6px 0;">
                        ${project}
                    </h2>

                    <p class="muted">
                        ${phase} • ${plots.length} Plots
                    </p>
                </div>
            </div>

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fill,minmax(240px,1fr));
                    gap:14px;
                    margin-top:20px;
                "
            >

                ${plots.map(plot => `

                    <div style="
                        border:1px solid #e5e7eb;
                        border-radius:14px;
                        padding:16px;
                        background:#fff;
                    ">

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                        ">

                            <strong style="font-size:20px;">
                                Plot ${plot.plotNumber}
                            </strong>

                            <span style="
                                padding:5px 9px;
                                border-radius:20px;
                                font-size:12px;
                                font-weight:700;
                                background:
                                    ${
                                        plot.status === "Sold"
                                            ? "#fee2e2"
                                            : "#dcfce7"
                                    };
                                color:
                                    ${
                                        plot.status === "Sold"
                                            ? "#b91c1c"
                                            : "#15803d"
                                    };
                            ">
                                ${plot.status}
                            </span>

                        </div>

                        <div style="
                            margin-top:14px;
                            font-size:13px;
                            line-height:1.8;
                        ">

                            <div>
                                <strong>Area:</strong>
                                ${
                                    Number(
                                        plot.areaSqM ||
                                        plot.sqM ||
                                        0
                                    ).toFixed(2)
                                }
                                Sq.M
                            </div>

                            <div>
                                <strong>Area:</strong>
                                ${
                                    Number(
                                        plot.areaSqFt ||
                                        plot.sqFt ||
                                        0
                                    ).toFixed(2)
                                }
                                Sq.Ft
                            </div>

                            <div>
                                <strong>Customer:</strong>
                                ${plot.customerName || "—"}
                            </div>

                            <div>
                                <strong>Phone:</strong>
                                ${plot.customerPhone || "—"}
                            </div>

                        </div>

                        <div style="margin-top:12px;">

                            <button
                                class="secondary-btn"
                                onclick="openPlotDetails(
                                    '${plot.project}',
                                    '${plot.phase}',
                                    ${plot.plotNumber}
                                )"
                                style="width:100%;"
                            >
                                View / Update Plot
                            </button>

                        </div>

                    </div>

                `).join("")}

            </div>

        </div>
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

function renderPropertyPlotsHTML(){

  const filterElement = document.getElementById("plotStatusFilter");
  const filter = filterElement ? filterElement.value : "All";

  const plots = getAllPropertyPlots().filter(plot =>
    filter === "All" || plot.status === filter
);

  if(plots.length === 0){
    return `
      <div style="padding:30px;text-align:center;">
        <strong>No plots found</strong>
        <p class="muted">No plots match the selected status.</p>
      </div>
    `;
  }

  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;">

      ${plots.map(plot => {

        let statusColor = "#64748b";
        let statusBg = "#f1f5f9";

        if(plot.status === "Sold"){
          statusColor = "#b91c1c";
          statusBg = "#fee2e2";
        }

        if(plot.status === "Available"){
          statusColor = "#15803d";
          statusBg = "#dcfce7";
        }

        if(plot.status === "On Hold"){
          statusColor = "#b45309";
          statusBg = "#fef3c7";
        }

        if(plot.status === "Pipeline"){
          statusColor = "#1d4ed8";
          statusBg = "#dbeafe";
        }

        if(plot.status === "Site Visit"){
          statusColor = "#6d28d9";
          statusBg = "#ede9fe";
        }

        return `
          <div style="border:1px solid #e5e7eb;border-radius:14px;padding:16px;background:#fff;">

            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong style="font-size:20px;">Plot ${plot.plotNumber}</strong>

              <span style="background:${statusBg};color:${statusColor};padding:5px 9px;border-radius:20px;font-size:12px;font-weight:700;">
                ${plot.status}
              </span>
            </div>

            <div style="margin-top:14px;font-size:13px;line-height:1.8;">

              <div>
                <strong>Customer:</strong>
                ${plot.customerName || "—"}
              </div>

              <div>
                <strong>Phone:</strong>
                ${plot.customerPhone || "—"}
              </div>

              <div>
                <strong>Employee:</strong>
                ${plot.assignedEmployee || "—"}
              </div>

              <div>
                <strong>Visit:</strong>
                ${plot.visitDate || "—"}
              </div>

              <div>
                <strong>Hold Until:</strong>
                ${plot.holdUntil || "—"}
              </div>

              <div>
                <strong>Follow-up:</strong>
                ${plot.followUpDate || "—"}
              </div>

            </div>

            <div style="margin-top:12px;">
              <button
                class="secondary-btn"
                onclick="openPlotDetails(
    '${plot.project}',
    '${plot.phase}',
    ${plot.plotNumber}
)"
                style="width:100%;">
                ${canEditPropertyPlot() ? "View / Update Plot" : "View Plot"}
              </button>
            </div>

          </div>
        `;
      }).join("")}

    </div>
  `;
}

function renderPropertyPlots(){
  const container = document.getElementById("propertyPlotsContainer");
  if(container){
    container.innerHTML = renderPropertyPlotsHTML();
  }
}

function openPlotDetails(project, phase, plotNumber) {

    const plot = findPropertyPlot(
        project,
        phase,
        plotNumber
    );

    if (!plot) {
        alert("Plot not found.");
        return;
    }

    // Remove existing popup if already open
    const oldModal = document.getElementById("plotDetailsModal");
    if (oldModal) oldModal.remove();

    // Create modal
    const modal = document.createElement("div");
    modal.id = "plotDetailsModal";

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.65);
            backdrop-filter:blur(5px);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        ">

            <div style="
                width:100%;
                max-width:650px;
                max-height:90vh;
                overflow-y:auto;
                background:#ffffff;
                border-radius:20px;
                box-shadow:0 25px 70px rgba(0,0,0,0.3);
            ">

                <!-- HEADER -->
                <div style="
                    padding:22px 24px;
                    border-bottom:1px solid #e5e7eb;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                    <div>
                        <div style="
                            font-size:22px;
                            font-weight:800;
                            color:#111827;
                        ">
                            Plot ${plot.plotNumber}
                        </div>

                        <div style="
                            font-size:13px;
                            color:#6b7280;
                            margin-top:4px;
                        ">
                            ${plot.project} • ${plot.phase}
                            <div style="
    margin-top:8px;
    font-size:14px;
    font-weight:700;
    color:#111827;
">
    ${Number(plot.areaSqM || plot.sqM || 0).toFixed(2)} Sq.M
    &nbsp; • &nbsp;
    ${Number(plot.areaSqFt || plot.sqFt || 0).toFixed(2)} Sq.Ft
</div>
                        </div>
                    </div>

                    <button id="closePlotModal"
                        style="
                            width:38px;
                            height:38px;
                            border:0;
                            border-radius:50%;
                            background:#f3f4f6;
                            font-size:22px;
                            cursor:pointer;
                            color:#374151;
                        ">
                        ×
                    </button>

                </div>


                <!-- FORM -->
                <div style="padding:24px;">

                    <!-- STATUS -->
                    <label style="
                        display:block;
                        font-size:13px;
                        font-weight:700;
                        color:#374151;
                        margin-bottom:7px;
                    ">
                        Plot Status
                    </label>

                    <select id="plotStatus"
                        style="
                            width:100%;
                            padding:12px;
                            border:1px solid #d1d5db;
                            border-radius:10px;
                            font-size:14px;
                            margin-bottom:18px;
                            background:white;
                        ">

                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Pipeline">Pipeline</option>
                        <option value="Site Visit">Site Visit</option>

                    </select>


                    <!-- CUSTOMER -->
                    <label style="
                        display:block;
                        font-size:13px;
                        font-weight:700;
                        color:#374151;
                        margin-bottom:7px;
                    ">
                        Customer Name
                    </label>

                    <input id="plotCustomerName"
                        type="text"
                        placeholder="Enter customer name"
                        value="${escapeHtml(plot.customerName || "")}"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #d1d5db;
                            border-radius:10px;
                            font-size:14px;
                            margin-bottom:18px;
                        ">


                    <!-- PHONE -->
                    <label style="
                        display:block;
                        font-size:13px;
                        font-weight:700;
                        color:#374151;
                        margin-bottom:7px;
                    ">
                        Customer Phone
                    </label>

                    <input id="plotCustomerPhone"
                        type="tel"
                        placeholder="Enter phone number"
                        value="${escapeHtml(plot.customerPhone || "")}"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #d1d5db;
                            border-radius:10px;
                            font-size:14px;
                            margin-bottom:18px;
                        ">


                    <!-- EMPLOYEE -->
                    <label style="
                        display:block;
                        font-size:13px;
                        font-weight:700;
                        color:#374151;
                        margin-bottom:7px;
                    ">
                        Assigned Employee
                    </label>

                    <input id="plotEmployee"
                        type="text"
                        placeholder="Enter employee name"
                        value="${escapeHtml(plot.assignedEmployee || "")}"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #d1d5db;
                            border-radius:10px;
                            font-size:14px;
                            margin-bottom:18px;
                        ">


                    <!-- DATES -->
                    <div style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:14px;
                    ">

                        <div>
                            <label style="
                                display:block;
                                font-size:13px;
                                font-weight:700;
                                color:#374151;
                                margin-bottom:7px;
                            ">
                                Site Visit Date
                            </label>

                            <input id="plotVisitDate"
                                type="date"
                                value="${escapeHtml(plot.visitDate || "")}"
                                style="
                                    width:100%;
                                    box-sizing:border-box;
                                    padding:12px;
                                    border:1px solid #d1d5db;
                                    border-radius:10px;
                                ">
                        </div>


                        <div>
                            <label style="
                                display:block;
                                font-size:13px;
                                font-weight:700;
                                color:#374151;
                                margin-bottom:7px;
                            ">
                                Hold Until
                            </label>

                            <input id="plotHoldUntil"
                                type="date"
                                value="${escapeHtml(plot.holdUntil || "")}"
                                style="
                                    width:100%;
                                    box-sizing:border-box;
                                    padding:12px;
                                    border:1px solid #d1d5db;
                                    border-radius:10px;
                                ">
                        </div>

                    </div>


                    <!-- FOLLOW UP -->
                    <div style="margin-top:18px;">

                        <label style="
                            display:block;
                            font-size:13px;
                            font-weight:700;
                            color:#374151;
                            margin-bottom:7px;
                        ">
                            Follow-up Date
                        </label>

                        <input id="plotFollowUp"
                            type="date"
                            value="${escapeHtml(plot.followUpDate || "")}"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:12px;
                                border:1px solid #d1d5db;
                                border-radius:10px;
                            ">

                    </div>


                    <!-- NOTES -->
                    <div style="margin-top:18px;">

                        <label style="
                            display:block;
                            font-size:13px;
                            font-weight:700;
                            color:#374151;
                            margin-bottom:7px;
                        ">
                            Notes
                        </label>

                        <textarea id="plotNotes"
                            rows="4"
                            placeholder="Add customer requirements, discussion details, payment notes etc."
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:12px;
                                border:1px solid #d1d5db;
                                border-radius:10px;
                                font-size:14px;
                                resize:vertical;
                            ">${escapeHtml(plot.notes || "")}</textarea>

                    </div>


                    <!-- BUTTONS -->
                    <div style="
                        display:flex;
                        gap:12px;
                        margin-top:24px;
                    ">

                        <button id="cancelPlotUpdate"
                            style="
                                flex:1;
                                padding:13px;
                                border:1px solid #d1d5db;
                                border-radius:10px;
                                background:#ffffff;
                                color:#374151;
                                font-weight:700;
                                cursor:pointer;
                            ">
                            Cancel
                        </button>

                        <button id="savePlotUpdate"
                            style="
                                flex:1;
                                padding:13px;
                                border:0;
                                border-radius:10px;
                                background:#111827;
                                color:#ffffff;
                                font-weight:700;
                                cursor:pointer;
                            ">
                            Save Changes
                        </button>

                    </div>

                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    if (!canEditPropertyPlot()) {
        [
            "plotStatus",
            "plotCustomerName",
            "plotCustomerPhone",
            "plotEmployee",
            "plotVisitDate",
            "plotHoldUntil",
            "plotFollowUp",
            "plotNotes"
        ].forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.disabled = true;
                field.style.background = "#f8fafc";
                field.style.cursor = "not-allowed";
            }
        });

        const saveButton = document.getElementById("savePlotUpdate");
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.style.opacity = "0.55";
            saveButton.style.cursor = "not-allowed";
            saveButton.textContent = "View Only";
        }
    }

    // Set current status
    document.getElementById("plotStatus").value =
        plot.status || "Available";


    // CLOSE FUNCTIONS
    const closeModal = () => {
        modal.remove();
    };

    document
        .getElementById("closePlotModal")
        .onclick = closeModal;

    document
        .getElementById("cancelPlotUpdate")
        .onclick = closeModal;


    // SAVE
    document
        .getElementById("savePlotUpdate")
        .onclick = async function () {

            if (!canEditPropertyPlot()) {
                alert("You do not have permission to edit property plots.");
                return;
            }

            plot.status =
                document.getElementById("plotStatus").value;

            plot.customerName =
                document.getElementById("plotCustomerName").value.trim();

            plot.customerPhone =
                document.getElementById("plotCustomerPhone").value.trim();

            plot.assignedEmployee =
                document.getElementById("plotEmployee").value.trim();

            plot.visitDate =
                document.getElementById("plotVisitDate").value;

            plot.holdUntil =
                document.getElementById("plotHoldUntil").value;

            plot.followUpDate =
                document.getElementById("plotFollowUp").value;

            plot.notes =
                document.getElementById("plotNotes").value.trim();

            // =============================================
            // C1PX - SAVE PLOT DATA GENERICALLY
            // =============================================

            const storageKey =
                `${plot.project}|${plot.phase}`;

            const allPropertyPlotData = JSON.parse(
                localStorage.getItem("c1pxPropertyPlotData") || "{}"
            );

            if (!allPropertyPlotData[storageKey]) {
                allPropertyPlotData[storageKey] = {};
            }

            allPropertyPlotData[storageKey][String(plot.plotNumber)] = {
                status: plot.status,
                customerName: plot.customerName || "",
                customerPhone: plot.customerPhone || "",
                assignedEmployee: plot.assignedEmployee || "",
                visitDate: plot.visitDate || "",
                holdUntil: plot.holdUntil || "",
                followUpDate: plot.followUpDate || "",
                notes: plot.notes || ""
            };

            localStorage.setItem(
                "c1pxPropertyPlotData",
                JSON.stringify(allPropertyPlotData)
            );

            try {
                await savePropertyPlotToSupabase(plot);
                console.log(
                    "C1PX Plot Saved To Supabase:",
                    storageKey,
                    plot.plotNumber
                );
            } catch (saveError) {
                console.error("C1PX permanent plot save failed:", saveError);
                alert(
                    "⚠️ Plot was updated in this browser, but permanent database save failed.\n\n" +
                    "Please run the C1PX Supabase migration supplied with this project."
                );
            }

            // Refresh the current project/phase
            openPropertyPlots(
                plot.project,
                plot.phase,
                null
            );

            renderPropertyPlots();
            closeModal();

            alert(
                `Plot ${plot.plotNumber} updated successfully.`
            );
        };


    // Close when clicking outside popup
    modal.firstElementChild.onclick = function(e) {

        if (e.target === modal.firstElementChild) {
            closeModal();
        }

    };
}


// Escape HTML safely
function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function checkBirthdayToday(){
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  leads.forEach(lead => {
    if(!lead.dob || !lead.whatsapp) return;

    const dob = new Date(lead.dob);
    const dobMonth = String(dob.getMonth() + 1).padStart(2, "0");
    const dobDay = String(dob.getDate()).padStart(2, "0");

    if(dobMonth === month && dobDay === day){

      const message = encodeURIComponent(
        `🎉 Happy Birthday ${lead.name}! 🎂\n\n` +
        `Wishing you a very happy and successful birthday from JMD Group! 🏡✨\n\n` +
        `May your year ahead be filled with happiness, success and prosperity. ❤️\n\n` +
        `Warm wishes,\nJMD Group`
      );

      lead.birthdayMessage =
        `https://wa.me/${lead.whatsapp.replace(/\D/g, "")}?text=${message}`;

      console.log(`🎂 Birthday today: ${lead.name}`);
    }
  });
}

checkBirthdayToday();

setInterval(checkBirthdayToday, 60000);

async function loadPage(page){
 navItems.forEach(n=>n.classList.toggle("active", n.dataset.page===page));
 pageTitle.textContent = page.charAt(0).toUpperCase()+page.slice(1);
 if(page==="dashboard") appContent.innerHTML=dashboardHTML();
 else if(page==="leads"){appContent.innerHTML=leadsHTML(); setTimeout(renderLeadRows,0);}
 else if(page==="customers"){ appContent.innerHTML=customersHTML(); setTimeout(loadCustomers,0);}
 else if(page==="tasks"){ appContent.innerHTML=tasksHTML(); setTimeout(loadTasks,0);}
 else if(page==="meetings"){ appContent.innerHTML=meetingsHTML(); setTimeout(loadMeetings,0);}
 else if(page==="reminders"){ appContent.innerHTML=remindersHTML(); setTimeout(loadC1PXReminders,0);}
 else if(page==="notifications"){ appContent.innerHTML=notificationsHTML(); setTimeout(loadNotifications,0);}
 else if(page==="followups"){
  appContent.innerHTML=followupsHTML();
  setTimeout(renderFollowupRows,0);
}
else if(page==="visits"){
  appContent.innerHTML=siteVisitsHTML();
  setTimeout(renderSiteVisitRows,0);
}
 else if(page==="projects") appContent.innerHTML=genericPage("Projects","Manage JMD Property projects.","PROJECT MANAGEMENT");
else if(page==="properties") {

    appContent.innerHTML = `
        <div style="padding:30px;">
            <div class="muted">
                Loading property inventory...
            </div>
        </div>
    `;

    await loadPropertyPhases();
    await loadPropertyPlotsFromSupabase();
    await loadC1PXProjects();
    await loadC1PXDynamicPlots();

    appContent.innerHTML = propertiesHTML();
}
else if(page==="employees") {
    appContent.innerHTML = employeesHTML();
    await loadEmployees();
    appContent.innerHTML = employeesHTML();
}
 else if(page==="reports") appContent.innerHTML=genericPage("Reports","View CRM performance and lead conversion.","ANALYTICS");
 else if(page==="activity") appContent.innerHTML=genericPage("Activity History","Track who changed what in the CRM.","AUDIT TRAIL");
 else if(page==="birthday-settings") appContent.innerHTML=birthdaySettingsHTML();
 bindPageEvents();
 if(window.innerWidth<=800) closeMobileSidebar();
}

function bindPageEvents(){
 document.querySelectorAll("[data-nav]").forEach(btn=>btn.addEventListener("click",()=>loadPage(btn.dataset.nav)));
 const addBtn=document.getElementById("addLeadBtn"); if(addBtn) addBtn.addEventListener("click",openLeadModal);
 const importBtn=document.getElementById("importLeadsBtn"); if(importBtn) importBtn.addEventListener("click",openLeadImportModal);
 ["leadSearch","statusFilter","projectFilter","typeFilter","sourceFilter","assignedFilter"].forEach(id=>{
   const el=document.getElementById(id);
   if(el) el.addEventListener(id==="leadSearch" ? "input" : "change", renderLeadRows);
 });
 const clearLeadFiltersBtn = document.getElementById("clearLeadFiltersBtn");
 if(clearLeadFiltersBtn) clearLeadFiltersBtn.addEventListener("click",()=>{
   ["leadSearch","statusFilter","projectFilter","typeFilter","sourceFilter","assignedFilter"].forEach(id=>{
     const el=document.getElementById(id);
     if(el) el.value="";
   });
   renderLeadRows();
 });
}

function initials(name){return name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();}
function formatDate(v){if(!v)return "";return new Date(v+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short"});}
function formatTime(v){if(!v)return "";let [h,m]=v.split(":").map(Number);let ap=h>=12?"PM":"AM";h=h%12||12;return `${h}:${String(m).padStart(2,"0")} ${ap}`;}

const leadModal=document.getElementById("leadModal");
const leadForm=document.getElementById("leadForm");
const closeLeadModal=document.getElementById("closeLeadModal");
const cancelLead=document.getElementById("cancelLead");
const detailsModal=document.getElementById("detailsModal");
const closeDetailsModal=document.getElementById("closeDetailsModal");

function openLeadModal(){leadModal.classList.add("show");}
function closeModal(){leadModal.classList.remove("show");leadForm.reset();}
closeLeadModal.addEventListener("click",closeModal);
cancelLead.addEventListener("click",closeModal);

leadForm.addEventListener("submit", async e => {
    e.preventDefault();

    const data = Object.fromEntries(
        new FormData(leadForm).entries()
    );

    const editingId = leadForm.dataset.editingId;

    const leadData = {
        name: data.name || null,
        phone: data.phone || null,
        email: data.email || null,
        job_title: data.job_title || null,
        dob: data.dob || null,

        source: data.source || "Manual",
        status: data.status || "New",
        assigned_employee: data.assigned || null,

        follow_up_date: data.followupDate || null,
        follow_up_time: data.followupTime || null,
        follow_up_completed: false,

        notes: data.notes || null,

        location: data.location || null,
        budget: data.budget || null,
        project: data.project || null,
        type: data.type || null,
        whatsapp: data.whatsapp || null
    };


    // ==========================================
    // EDIT EXISTING LEAD
    // ==========================================

    if (editingId) {

        const { error } = await db
            .from("leads")
            .update(leadData)
            .eq("id", editingId);

        if (error) {
            console.error("Supabase update error:", error);

            alert(
                "❌ Lead could not be updated:\n" +
                error.message
            );

            return;
        }

        // Update local CRM data
        const index = leads.findIndex(
            x => String(x.id) === String(editingId)
        );

        if (index !== -1) {
            leads[index] = {
                ...leads[index],
                ...leadData,
                id: leads[index].id
            };
        }

        alert("✅ Lead updated successfully!");

        leadForm.dataset.editingId = "";

        closeModal();

        await loadPage("leads");

        return;
    }


    // ==========================================
    // CREATE NEW LEAD — DUPLICATE PROTECTION
    // ==========================================

    const normalizeLeadPhoneForSave = value => {
        const digits = String(value ?? "").replace(/\D/g, "");
        return digits.length > 10 ? digits.slice(-10) : digits;
    };
    const normalizeLeadEmailForSave = value => String(value ?? "").trim().toLowerCase();

    const newPhone = normalizeLeadPhoneForSave(leadData.phone);
    const newEmail = normalizeLeadEmailForSave(leadData.email);

    if (newPhone || newEmail) {
        const { data: possibleDuplicates, error: duplicateCheckError } = await db
            .from("leads")
            .select("id,name,phone,email")
            .eq("company_id", currentCompany.id);

        if (duplicateCheckError) {
            console.error("Duplicate check error:", duplicateCheckError);
            alert("❌ Could not check for duplicate leads:\n" + duplicateCheckError.message);
            return;
        }

        const duplicate = (possibleDuplicates || []).find(existing => {
            const existingPhone = normalizeLeadPhoneForSave(existing.phone);
            const existingEmail = normalizeLeadEmailForSave(existing.email);
            return (newPhone && existingPhone && newPhone === existingPhone) ||
                   (newEmail && existingEmail && newEmail === existingEmail);
        });

        if (duplicate) {
            const matchedBy = newPhone && normalizeLeadPhoneForSave(duplicate.phone) === newPhone
                ? "mobile number"
                : "email";
            alert(`⚠️ Lead already exists!\n\n${duplicate.name || "This lead"} is already in the CRM.\nMatched by: ${matchedBy}\n\nNo duplicate lead was added.`);
            return;
        }
    }

const { data: savedLead, error } = await db
    .from("leads")
    .insert([leadData])
    .select()
    .single();

if (error) {

    console.error("Supabase insert error:", error);

    alert(
        "❌ Lead could not be saved:\n" +
        error.message
    );

    return;
}

// Add newly saved lead to the top of the local list
leads.unshift(savedLead);

alert("✅ Lead saved successfully!");

closeModal();

// Refresh Leads page immediately
await loadPage("leads");

    alert("✅ Lead saved successfully!");

    closeModal();

    await loadPage("leads");
});

function viewLead(id){
 const l=leads.find(x=>x.id===id); if(!l)return;
 document.getElementById("detailsName").textContent=l.name;
 document.getElementById("leadDetailsBody").innerHTML=`
 <div class="details-top"><span class="status ${statusClass(l.status)}">${l.status}</span><div class="detail-actions"><a href="tel:${String(l.phone || "").replaceAll(" ","")}" class="call-btn">📞 Call</a><a href="https://wa.me/${String(l.whatsapp || "").replaceAll(/\D/g,"")} target="_blank" class="whatsapp-btn">💬 WhatsApp</a></div></div>
 <div class="details-grid">
<div><span>Mobile</span><strong>${String(l.phone || "")}</strong></div>
<div><span>Job Title</span><strong>${String(l.job_title || "-")}</strong></div>
<div><span>Date of Birth</span><strong>${String(l.dob || "-")}</strong></div>
<div><span>Location</span><strong>${String(l.location || "-")}</strong></div>
  <div><span>Project</span><strong>${String(l.project || "")}</strong></div><div><span>Property Type</span><strong>${String(l.type || "")}</strong></div>
  <div><span>Budget</span><strong>${String(l.budget || "")}</strong></div><div><span>Lead Source</span><strong>${String(l.source || "")}</strong></div>
  <div><span>Assigned To</span><strong>${String(l.assigned || "")}</strong></div><div><span>Next Follow-up</span><strong>${String(l.followupDate ? formatDate(l.followupDate) + " • " + formatTime(l.followupTime) : "—")}</strong></div>
 </div>
 <div class="detail-section"><h4>Requirement / Notes</h4><p>${String(l.notes || "No notes added.")}</p></div>
 <div class="detail-section"><h4>Activity Timeline</h4><div class="timeline">${(Array.isArray(l.timeline) ? l.timeline : []).map((x,i) =>`<div class="timeline-item"><span></span><div><strong>${x}</strong><small>${i===0?"Lead created recently":"Activity recorded"}</small></div></div>`).join("")}</div></div>`;
 detailsModal.classList.add("show");
}
closeDetailsModal.addEventListener("click",()=>detailsModal.classList.remove("show"));

window.editLead = async (id) => {
    const lead = leads.find(x => x.id === id);

    if (!lead) {
        alert("❌ Lead not found");
        return;
    }

    // Open lead modal
    leadModal.classList.add("show");

    // Fill existing lead data
    const setValue = (name, value) => {
        const field = leadForm.querySelector(`[name="${name}"]`);
        if (field) field.value = value ?? "";
    };

    setValue("name", lead.name);
    setValue("phone", lead.phone);
    setValue("email", lead.email);
    setValue("job_title", lead.job_title);
    setValue("dob", lead.dob);
    setValue("source", lead.source);
    setValue("status", lead.status);
    setValue("assigned", lead.assigned_employee || lead.assigned || "");
    setValue("followupDate", lead.follow_up_date || lead.followupDate || "");
    setValue("followupTime", lead.follow_up_time || lead.followupTime || "");
    setValue("notes", lead.notes);
    setValue("location", lead.location);
    setValue("budget", lead.budget);
    setValue("project", lead.project);
    setValue("type", lead.type);
    setValue("whatsapp", lead.whatsapp);

    // Mark form as EDIT mode
    leadForm.dataset.editingId = id;

    // Change button text
    const submitBtn = leadForm.querySelector('[type="submit"]');

    if (submitBtn) {
        submitBtn.textContent = "Update Lead";
    }

    // Change modal title if available
    const title = leadModal.querySelector("h2, h3, .modal-title");

    if (title) {
        title.textContent = "Edit Lead";
    }
};


/* =====================================================
   C1PX MOBILE SIDEBAR — TOUCH / OUTSIDE CLICK FIX
   ===================================================== */
const sidebarOverlay = document.getElementById("sidebarOverlay");

function setMobileSidebar(open) {
    if (!sidebar || window.innerWidth > 800) return;

    sidebar.classList.toggle("open", open);

    if (sidebarOverlay) {
        sidebarOverlay.classList.toggle("show", open);
        sidebarOverlay.setAttribute("aria-hidden", open ? "false" : "true");
    }

    document.body.classList.toggle("sidebar-open", open);
}

function closeMobileSidebar() {
    setMobileSidebar(false);
}

function toggleMobileSidebar() {
    setMobileSidebar(!sidebar.classList.contains("open"));
}

if (mobileMenu) {
    mobileMenu.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggleMobileSidebar();
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", function (event) {
        event.preventDefault();
        closeMobileSidebar();
    });
}

navItems.forEach(item => {
    item.addEventListener("click", function () {
        if (window.innerWidth <= 800) {
            closeMobileSidebar();
        }
        loadPage(item.dataset.page);
    });
});

/* Close drawer with Escape and when returning to desktop. */
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMobileSidebar();
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 800) {
        sidebar.classList.remove("open");
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
            sidebarOverlay.setAttribute("aria-hidden", "true");
        }
        document.body.classList.remove("sidebar-open");
    }
});

/* Swipe left on the drawer to close it. */
let sidebarTouchStartX = 0;
let sidebarTouchStartY = 0;

if (sidebar) {
    sidebar.addEventListener("touchstart", function (event) {
        if (window.innerWidth > 800 || !sidebar.classList.contains("open")) return;
        const touch = event.changedTouches[0];
        sidebarTouchStartX = touch.clientX;
        sidebarTouchStartY = touch.clientY;
    }, { passive: true });

    sidebar.addEventListener("touchend", function (event) {
        if (window.innerWidth > 800 || !sidebar.classList.contains("open")) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - sidebarTouchStartX;
        const dy = touch.clientY - sidebarTouchStartY;

        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) && dx < 0) {
            closeMobileSidebar();
        }
    }, { passive: true });
}


leadModal.addEventListener("click",e=>{if(e.target===leadModal)closeModal();});
detailsModal.addEventListener("click",e=>{if(e.target===detailsModal)detailsModal.classList.remove("show");});

function whatsappLead(id) {
    const lead = leads.find(x => x.id === id);

    if (!lead) {
        alert("Customer not found.");
        return;
    }

    const rawNumber = lead.whatsapp || lead.phone || "";

    if (!rawNumber) {
        alert("WhatsApp number is not available for this customer.");
        return;
    }

    let number = String(rawNumber).replace(/\D/g, "");

    // Indian 10-digit number
    if (number.length === 10) {
        number = "91" + number;
    }

    // Indian number entered as 0XXXXXXXXXX
    if (number.length === 11 && number.startsWith("0")) {
        number = "91" + number.substring(1);
    }

    if (number.length !== 12 || !number.startsWith("91")) {
        alert("Please enter a valid Indian WhatsApp number.");
        return;
    }

    const message =
`Hello ${lead.name}, 🎉

JMD Group wishes you a very Happy Birthday! 🎂 🥳

May this new year of your life bring you happiness, success, good health and prosperity. 💖

Best wishes,
JMD Group`;

    const encodedMessage = encodeURIComponent(message);

    window.open(
        `https://wa.me/${number}?text=${encodedMessage}`,
        "_blank"
    );
}

window.whatsappLead = whatsappLead;

loadPage("dashboard");

// Check birthdays when CRM opens
checkBirthdayLeads();
// ===============================
// SITE VISIT SCHEDULING
// ===============================
window.scheduleVisit = async (id) => {

    let lead;

    // If no lead ID was provided, let the user select a lead
    if (!id) {
        if (!leads || !leads.length) {
            alert("❌ No leads available");
            return;
        }

        const leadList = leads
            .map((l, i) => `${i + 1}. ${l.name} - ${l.phone || ""} - ${l.project || ""}`)
            .join("\n");

        const choice = prompt(
            "SELECT CUSTOMER / LEAD\n\n" +
            leadList +
            "\n\nEnter the lead number:"
        );

        if (!choice) return;

        const index = Number(choice) - 1;

        if (Number.isNaN(index) || !leads[index]) {
            alert("❌ Invalid lead selection");
            return;
        }

        lead = leads[index];

    } else {
        // Existing behavior when called from Leads page
        lead = leads.find(x => x.id == id);

        if (!lead) {
            alert("❌ Lead not found");
            return;
        }
    }

   // =====================================================
// C1PX - SITE VISIT DATE + TIME MODAL
// =====================================================

const visitDetails = await new Promise((resolve) => {

    const modal = document.createElement("div");

    modal.id = "siteVisitDateTimeModal";

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(15,23,42,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        ">

            <div style="
                width:100%;
                max-width:460px;
                background:#fff;
                border-radius:18px;
                padding:28px;
                box-shadow:0 25px 70px rgba(0,0,0,.25);
            ">

                <h2 style="
                    margin:0 0 6px;
                    font-size:22px;
                ">
                    Schedule Site Visit
                </h2>

                <p style="
                    margin:0 0 22px;
                    color:#64748b;
                    font-size:14px;
                ">
                    Customer:
                    <strong>${escapeHtml(lead.name || "-")}</strong>
                    <br>
                    Project:
                    <strong>${escapeHtml(lead.project || "-")}</strong>
                </p>


                <!-- DATE -->

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Visit Date
                </label>

                <input
                    id="siteVisitDateInput"
                    type="text"
                    inputmode="numeric"
                    maxlength="10"
                    placeholder="dd/MM/YYYY"
                    autocomplete="off"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:13px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        font-size:15px;
                        margin-bottom:20px;
                    "
                >


                <!-- TIME -->

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Visit Time
                </label>

                <div style="
                    display:grid;
                    grid-template-columns:1fr 1fr 1fr;
                    gap:10px;
                    margin-bottom:22px;
                ">

                    <select
                        id="siteVisitHour"
                        style="
                            padding:13px;
                            border:1px solid #d1d5db;
                            border-radius:10px;
                            font-size:15px;
                        "
                    >
                        ${Array.from({length:12}, (_,i) => {
                            const hour = i + 1;
                            return `
                                <option value="${hour}">
                                    ${hour}
                                </option>
                            `;
                        }).join("")}
                    </select>

                    <select
                        id="siteVisitMinute"
                        style="
                            padding:13px;
                            border:1px solid #d1d5db;
                            border-radius:10px;
                            font-size:15px;
                        "
                    >
                        ${Array.from({length:12}, (_,i) => {
                            const minute = String(i * 5).padStart(2,"0");
                            return `
                                <option value="${minute}">
                                    ${minute}
                                </option>
                            `;
                        }).join("")}
                    </select>

                    <select
                        id="siteVisitAmPm"
                        style="
                            padding:13px;
                            border:1px solid #d1d5db;
                            border-radius:10px;
                            font-size:15px;
                        "
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>

                </div>


                <div style="
                    display:flex;
                    justify-content:flex-end;
                    gap:10px;
                ">

                    <button
                        type="button"
                        id="cancelSiteVisitDateTime"
                        class="secondary-btn"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="saveSiteVisitDateTime"
                        class="primary-btn"
                    >
                        Continue
                    </button>

                </div>

                <div
                    id="siteVisitDateTimeMessage"
                    style="
                        margin-top:14px;
                        color:#dc2626;
                        font-size:14px;
                    "
                ></div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);


    // =================================================
    // DATE AUTO FORMAT
    // =================================================

    const dateInput = document.getElementById("siteVisitDateInput");

if (dateInput) {

    dateInput.addEventListener("input", function (event) {

        const input = event.target;

        const oldValue = input.value;
        const oldCursor = input.selectionStart || 0;

        // Count digits before the cursor
        const digitsBeforeCursor =
            oldValue
                .slice(0, oldCursor)
                .replace(/\D/g, "")
                .length;

        // Keep only numbers
        const digits = oldValue
            .replace(/\D/g, "")
            .slice(0, 8);

        let formatted = "";

        if (digits.length <= 2) {

            formatted = digits;

        } else if (digits.length <= 4) {

            formatted =
                digits.slice(0, 2) +
                "/" +
                digits.slice(2);

        } else {

            formatted =
                digits.slice(0, 2) +
                "/" +
                digits.slice(2, 4) +
                "/" +
                digits.slice(4);
        }

        input.value = formatted;

        // Restore cursor position
        let newCursor = 0;
        let digitCount = 0;

        while (
            newCursor < formatted.length &&
            digitCount < digitsBeforeCursor
        ) {

            if (/\d/.test(formatted[newCursor])) {
                digitCount++;
            }

            newCursor++;
        }

        input.setSelectionRange(
            newCursor,
            newCursor
        );
    });
}

    // Default time: 11:00 AM

    document.getElementById("siteVisitHour").value = "11";
    document.getElementById("siteVisitMinute").value = "00";
    document.getElementById("siteVisitAmPm").value = "AM";


    // =================================================
    // CANCEL
    // =================================================

    document
        .getElementById("cancelSiteVisitDateTime")
        .onclick = function () {

            modal.remove();
            resolve(null);
        };


    // =================================================
    // CONTINUE
    // =================================================

    document
        .getElementById("saveSiteVisitDateTime")
        .onclick = function () {

            const dateValue =
                dateInput.value.trim();

            const message =
                document.getElementById(
                    "siteVisitDateTimeMessage"
                );


            // Validate dd/MM/YYYY

            const match =
                dateValue.match(
                    /^(\d{2})\/(\d{2})\/(\d{4})$/
                );

            if (!match) {

                message.textContent =
                    "Please enter date like 18/09/2026.";

                return;
            }


            const day =
    Number(match[1]);

const month =
    Number(match[2]);

const year =
    Number(match[3]);


            const testDate =
                new Date(
                    year,
                    month - 1,
                    day
                );


            if (
                testDate.getFullYear() !== year ||
                testDate.getMonth() !== month - 1 ||
                testDate.getDate() !== day
            ) {

                message.textContent =
                    "Please enter a valid date.";

                return;
            }


            // Time

            const hour =
                Number(
                    document.getElementById(
                        "siteVisitHour"
                    ).value
                );

            const minute =
                document.getElementById(
                    "siteVisitMinute"
                ).value;

            const ampm =
                document.getElementById(
                    "siteVisitAmPm"
                ).value;


            let dbHour = hour;


            if (ampm === "AM" && hour === 12) {
                dbHour = 0;
            }

            if (ampm === "PM" && hour !== 12) {
                dbHour = hour + 12;
            }


            const formattedTime =
                String(dbHour).padStart(2, "0") +
                ":" +
                minute +
                ":00";


            // Database date format

            const visitDate =
                `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;


            modal.remove();


            resolve({
                visitDate: visitDate,
                formattedTime: formattedTime
            });
        };


    dateInput.focus();
});


// User cancelled

if (!visitDetails) {
    return;
}


const formattedDate =
    visitDetails.visitDate;

const formattedTime =
    visitDetails.formattedTime;
    const employee =
        lead.assigned_employee ||
        lead.assigned ||
        "";

    const notes = prompt(
        "Enter site visit notes:",
        `Site visit for ${lead.name}`
    );

    const { data, error } = await db
    
        .from("site_visits")
        .insert([{
            company_id: currentCompany?.id || null,
            lead_id: lead.id,
            property_id: null,
            visit_date: formattedDate,
            visit_time: formattedTime,
            employee: employee,
            status: "Scheduled",
            notes: notes || null
        }])
        .select();

    if (error) {
        console.error("Site visit error:", error);

        alert(
            "❌ Site visit could not be scheduled:\n\n" +
            error.message
        );

        return;
    }

    alert("✅ Site visit scheduled successfully!");
await loadPage("visits");
};

/* ==========================================
   TOPBAR DROPDOWNS
========================================== */

const notificationBtn = document.getElementById("notificationBtn");
const notificationDropdown = document.getElementById("notificationDropdown");

const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");


/* Notification button */

if (notificationBtn) {
    notificationBtn.addEventListener("click", function (event) {
        event.stopPropagation();

        notificationDropdown.classList.toggle("show");

        if (profileDropdown) {
            profileDropdown.classList.remove("show");
        }
    });
}


/* =========================================
   C1PX PROFILE BUTTON
========================================= */

if (profileBtn) {

    profileBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        const employee = window.currentEmployee;

        if (!employee) {
            console.warn("C1PX: No logged-in employee found.");
            return;
        }

        const name = employee.name || "User";

        const role =
            employee.role === "Admin"
                ? "Administrator"
                : (employee.role || "Employee");

        const initials = name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map(word => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();

        console.log("C1PX PROFILE:", {
            name: name,
            role: role,
            initials: initials,
            employee: employee
        });

        /* TOP RIGHT */
        const profileName =
            document.getElementById("profileName");

        const profileAvatar =
            document.getElementById("profileAvatar");

        if (profileName) {
            profileName.textContent = name;
        }

        if (profileAvatar) {
            profileAvatar.textContent = initials;
        }

        /* DROPDOWN HEADER */
        const sidebarName =
            document.getElementById("sidebarName");

        const sidebarRole =
            document.getElementById("sidebarRole");

        const sidebarAvatar =
            document.getElementById("sidebarAvatar");

        if (sidebarName) {
            sidebarName.textContent = name;
        }

        if (sidebarRole) {
            sidebarRole.textContent = role;
        }

        if (sidebarAvatar) {
            sidebarAvatar.textContent = initials;
        }

        /* OPEN DROPDOWN */
        if (profileDropdown) {
            profileDropdown.classList.toggle("show");
        }

        setTimeout(() => {

    const current = window.currentEmployee;

    if (!current) {
        console.warn("C1PX: currentEmployee missing");
        return;
    }

    const name = current.name || "User";

    const role =
        current.role === "Admin"
            ? "Administrator"
            : (current.role || "Employee");

    const initials = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

    const avatar = document.getElementById("sidebarAvatar");
    const nameEl = document.getElementById("sidebarName");
    const roleEl = document.getElementById("sidebarRole");

    if (avatar) {
        avatar.textContent = initials;
    }

    if (nameEl) {
        nameEl.textContent = name;
    }

    if (roleEl) {
        roleEl.textContent = role;
    }

    console.log("C1PX DROPDOWN FIX:", {
        name,
        role,
        initials
    });

}, 50);

        /* CLOSE NOTIFICATION DROPDOWN */
        if (notificationDropdown) {
            notificationDropdown.classList.remove("show");
        }

    });

}


/* Close dropdowns when clicking outside */

document.addEventListener("click", function () {

    if (notificationDropdown) {
        notificationDropdown.classList.remove("show");
    }

    if (profileDropdown) {
        profileDropdown.classList.remove("show");
    }

});


/* Keep dropdown open when clicking inside */

if (notificationDropdown) {
    notificationDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });
}

if (profileDropdown) {
    profileDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });
}


/* Mark all notifications as read */

const markNotificationsRead =
    document.getElementById("markNotificationsRead");

if (markNotificationsRead) {

    markNotificationsRead.addEventListener("click", function () {

        const items =
            document.querySelectorAll(".notification-item");

        items.forEach(item => {
            item.style.opacity = "0.55";
        });

        this.textContent = "All read";

    });

}


// ==========================================
// PROFILE MENU ACTIONS
// ==========================================

const profileAccountBtn = document.getElementById("profileAccountBtn");
const profileSettingsBtn = document.getElementById("profileSettingsBtn");
const profileLogoutBtn = document.getElementById("profileLogoutBtn");

function closeProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown");

    if (dropdown) {
        dropdown.classList.remove("show");
    }
}


// ==========================================
// MODAL CREATOR
// ==========================================

function openProfileModal(title, content) {

    const oldModal = document.getElementById("profileActionModal");

    if (oldModal) {
        oldModal.remove();
    }

    const modal = document.createElement("div");

    modal.id = "profileActionModal";
    modal.className = "modal-overlay";
    modal.style.display = "flex";

    modal.innerHTML = `
        <div class="modal" style="max-width:520px; width:90%;">

            <div class="modal-header">

                <div>
                    <span class="eyebrow">JMD PROPERTY</span>
                    <h3>${title}</h3>
                </div>

                <button class="close-btn" id="closeProfileActionModal">
                    ×
                </button>

            </div>

            <div style="padding:24px;">
                ${content}
            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document
        .getElementById("closeProfileActionModal")
        .addEventListener("click", () => {
            modal.remove();
        });

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            modal.remove();
        }

    });
}


// ==========================================
// MY ACCOUNT
// ==========================================

if (profileAccountBtn) {

    profileAccountBtn.addEventListener("click", () => {

        closeProfileDropdown();

        const employee = window.currentEmployee;

        if (!employee) {
            alert("Employee account data is not loaded.");
            return;
        }

        const name = employee.name || "";
        const role = employee.role || "Employee";
        const email = employee.email || "";
        const phone = employee.phone || "";

        const initials = name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("") || "U";

        openProfileModal(
            "My Account",
            `
            <div style="
                display:flex;
                align-items:center;
                gap:16px;
                margin-bottom:24px;
            ">

                <div class="avatar-large">
                    ${initials}
                </div>

                <div>
                    <strong
                        id="accountDisplayName"
                        style="font-size:18px;"
                    >
                        ${name}
                    </strong>

                    <small
                        style="
                            display:block;
                            margin-top:4px;
                            color:#6b7280;
                        "
                    >
                        ${role === "Admin" ? "Administrator" : role}
                    </small>
                </div>

            </div>

            <div class="form-grid">

                <label>
                    Full Name

                    <input
                        id="accountFullName"
                        type="text"
                        value="${name.replace(/"/g, "&quot;")}"
                        placeholder="Enter full name"
                    >
                </label>

                <label>
                    Role

                    <input
                        type="text"
                        value="${role}"
                        readonly
                    >
                </label>

                <label>
                    Email

                    <input
                        id="accountEmail"
                        type="email"
                        value="${email.replace(/"/g, "&quot;")}"
                        readonly
                        style="background:#f3f4f6;cursor:not-allowed;"
                    >
                </label>

                <label>
                    Phone Number

                    <input
                        id="accountPhone"
                        type="tel"
                        value="${phone.replace(/"/g, "&quot;")}"
                        placeholder="+91 XXXXX XXXXX"
                    >
                </label>

            </div>

            <div style="
                margin-top:24px;
                text-align:right;
            ">

                <button
                    type="button"
                    class="primary-btn"
                    id="saveAccountChangesBtn"
                >
                    Save Changes
                </button>

            </div>

            <div
                id="accountSaveMessage"
                style="
                    margin-top:12px;
                    font-size:14px;
                "
            ></div>
            `
        );

        const saveButton =
            document.getElementById("saveAccountChangesBtn");

        if (saveButton) {

            saveButton.addEventListener(
                "click",
                saveMyAccountChanges
            );

        }

    });

}


// ==========================================
// SAVE MY ACCOUNT
// ==========================================

async function saveMyAccountChanges() {

    const employee = window.currentEmployee;

    if (!employee) {
        alert("Employee account data is not loaded.");
        return;
    }

    const nameInput =
        document.getElementById("accountFullName");

    const phoneInput =
        document.getElementById("accountPhone");

    const message =
        document.getElementById("accountSaveMessage");

    const button =
        document.getElementById("saveAccountChangesBtn");

    if (!nameInput || !phoneInput) {
        return;
    }

    const name =
        nameInput.value.trim();

    const phone =
        phoneInput.value.trim();

    if (!name) {

        message.textContent =
            "Please enter your full name.";

        message.style.color = "#dc2626";

        return;
    }

    button.disabled = true;
    button.textContent = "Saving...";

    try {

        const { data, error } = await db
            .from("employees")
            .update({
                name: name,
                phone: phone || null,
                updated_at: new Date().toISOString()
            })
            .eq("id", employee.id)
            .eq("company_id", employee.company_id)
            .select()
            .single();

        if (error) {

            console.error(
                "My Account update error:",
                error
            );

            throw new Error(
                error.message ||
                "Failed to update account."
            );
        }

        // Update logged-in employee in memory
        window.currentEmployee = {
            ...window.currentEmployee,
            ...data
        };

        // Update top-right profile name
        document
            .querySelectorAll(".profile-name")
            .forEach(element => {
                element.textContent = name;
            });

        // Update sidebar employee name
        const userMini =
            document.querySelector(".user-mini");

        if (userMini) {

            const strong =
                userMini.querySelector("strong");

            if (strong) {
                strong.textContent = name;
            }

            const small =
                userMini.querySelector("small");

            if (small) {
                small.textContent =
                    employee.role === "Admin"
                        ? "Administrator"
                        : employee.role || "Employee";
            }
        }
        
    // Update profile dropdown header
    const sidebarName = document.getElementById("sidebarName");
    const sidebarRole = document.getElementById("sidebarRole");
    const sidebarAvatar = document.getElementById("sidebarAvatar");

    if (sidebarName) {
        sidebarName.textContent = name;
    }

    if (sidebarRole) {
        sidebarRole.textContent =
            employee.role === "Admin"
                ? "Administrator"
                : employee.role || "Employee";
    }

    if (sidebarAvatar) {
        sidebarAvatar.textContent = initials;
    }

        // Update account header
        const accountDisplayName =
            document.getElementById(
                "accountDisplayName"
            );

        if (accountDisplayName) {
            accountDisplayName.textContent = name;
        }

        message.textContent =
            "✓ Account updated successfully.";

        message.style.color = "#16a34a";

        button.textContent = "Saved";

        setTimeout(() => {

            const modal =
                document.getElementById(
                    "profileActionModal"
                );

            if (modal) {
                modal.remove();
            }

        }, 700);

    } catch (error) {

        console.error(
            "C1PX My Account Error:",
            error
        );

        message.textContent =
            error.message ||
            "Failed to update account.";

        message.style.color = "#dc2626";

        button.disabled = false;
        button.textContent = "Save Changes";

    }


}

// ==========================================
// C1PX - UPDATE PROFILE DROPDOWN
// ==========================================

function updateProfileDropdownUI() {

    const employee = window.currentEmployee;

    if (!employee) return;

    const name = employee.name || "User";

    const role =
        employee.role === "Admin"
            ? "Administrator"
            : employee.role || "Employee";

    const initials = name
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

    // Dropdown avatar
    const sidebarAvatar =
        document.getElementById("sidebarAvatar");

    if (sidebarAvatar) {
        sidebarAvatar.textContent = initials;
    }

    // Dropdown name
    const sidebarName =
        document.getElementById("sidebarName");

    if (sidebarName) {
        sidebarName.textContent = name;
    }

    // Dropdown role
    const sidebarRole =
        document.getElementById("sidebarRole");

    if (sidebarRole) {
        sidebarRole.textContent = role;
    }
}

// ==========================================
// SETTINGS
// ==========================================

if (profileSettingsBtn) {

    profileSettingsBtn.addEventListener("click", () => {

        closeProfileDropdown();

        openProfileModal(
            "Settings",
            `
            <div style="display:flex; flex-direction:column; gap:18px;">

                <div class="card" style="padding:18px;">

                    <strong>Notifications</strong>

                    <small style="display:block; margin-top:5px; color:#6b7280;">
                        Control CRM notification preferences.
                    </small>

                    <label style="display:flex; align-items:center; gap:10px; margin-top:15px;">
                        <input type="checkbox" checked>
                        Follow-up reminders
                    </label>

                    <label style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                        <input type="checkbox" checked>
                        Site visit reminders
                    </label>

                    <label style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                        <input type="checkbox" checked>
                        Birthday reminders
                    </label>

                </div>


                <div class="card" style="padding:18px;">
    <strong>🏢 Company Settings</strong>

    <small style="display:block; margin-top:5px; color:#6b7280;">
        Manage your company's information and branding.
    </small>

    <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:15px;
        margin-top:18px;
    ">

        <label>
            Company Name
            <input
                id="companySettingsName"
                type="text"
                value="${currentCompany?.name || ''}"
                placeholder="Company name"
            >
        </label>

        <label>
            Industry
            <input
                id="companySettingsIndustry"
                type="text"
                value="${currentCompany?.industry || ''}"
                placeholder="Real Estate"
            >
        </label>

<div style="grid-column:1 / -1; margin-top:10px;">

    <strong style="display:block; margin-bottom:12px;">
        📞 Company Contacts
    </strong>

    <div style="
        display:grid;
        grid-template-columns:1fr;
        gap:12px;
    ">

        ${
            companyContacts.length
                ? companyContacts.map((contact, index) => `
                    <div style="
                        border:1px solid #e5e7eb;
                        border-radius:10px;
                        padding:14px;
                        background:#fafafa;
                    ">

                        <div style="
                            font-weight:700;
                            margin-bottom:10px;
                        ">
                            ${contact.label || `Contact ${index + 1}`}
                        </div>

                        <div style="
                            display:grid;
                            grid-template-columns:1fr 1fr;
                            gap:12px;
                        ">

                            <label>
                                Name
                                <input
                                    id="contactName_${contact.id}"
                                    type="text"
                                    value="${contact.name || ''}"
                                    placeholder="Contact name"
                                >
                            </label>

                            <label>
                                Phone
                                <input
                                    id="contactPhone_${contact.id}"
                                    type="text"
                                    value="${contact.phone || ''}"
                                    placeholder="Phone number"
                                >
                            </label>

                            <label>
                                WhatsApp
                                <input
                                    id="contactWhatsapp_${contact.id}"
                                    type="text"
                                    value="${contact.whatsapp || ''}"
                                    placeholder="WhatsApp number"
                                >
                            </label>

                        </div>

                    </div>
                `).join("")
                : `
                    <div style="
                        padding:15px;
                        border:1px dashed #d1d5db;
                        border-radius:10px;
                        color:#6b7280;
                    ">
                        No company contacts found.
                    </div>
                `
        }

    </div>
</div>

        <label>
            Email
            <input
                id="companySettingsEmail"
                type="email"
                value="${currentCompany?.email || ''}"
                placeholder="company@email.com"
            >
        </label>

        <label>
            Website
            <input
                id="companySettingsWebsite"
                type="text"
                value="${currentCompany?.website || ''}"
                placeholder="https://example.com"
            >
        </label>

        <label style="grid-column:1 / -1;">
            Address
            <textarea
                id="companySettingsAddress"
                rows="3"
                placeholder="Company address"
            >${currentCompany?.address || ''}</textarea>
        </label>

        <label>
            GSTIN
            <input
                id="companySettingsGstin"
                type="text"
                value="${currentCompany?.gstin || ''}"
                placeholder="GSTIN"
            >
        </label>

        <label>
            Currency
            <input
                id="companySettingsCurrency"
                type="text"
                value="${currentCompany?.currency || 'INR'}"
                placeholder="INR"
            >
        </label>

        <label>
            Brand Color
            <input
                id="companySettingsBrandColor"
                type="color"
                value="${currentCompany?.brand_color || '#f97316'}"
                style="height:42px; padding:4px;"
            >
        </label>

        <label>
            Timezone
            <input
                id="companySettingsTimezone"
                type="text"
                value="${currentCompany?.timezone || 'Asia/Kolkata'}"
                placeholder="Asia/Kolkata"
            >
        </label>

    </div>
</div>

<div style="text-align:right; margin-top:15px;">
    <button
        class="primary-btn"
        onclick="saveCompanySettings()"
    >
        💾 Save Company Settings
    </button>
</div>

            </div>
            `
        );

    });

}


// ==========================================
// LOGOUT
// ==========================================

if (profileLogoutBtn) {

    profileLogoutBtn.addEventListener("click", async () => {

        closeProfileDropdown();

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            return;
        }

        try {
            await db.auth.signOut();
        } catch (error) {
            console.error("C1PX Logout Error:", error);
        }

        localStorage.removeItem("loggedInUser");
        sessionStorage.removeItem("c1pxSession");

        alert("You have been logged out.");

        window.location.reload();

    });

}
// Company and lead data are loaded only after Supabase authentication is restored.
// This prevents anonymous requests from touching tenant data.
  
// =====================================
// SAVE COMPANY SETTINGS
// =====================================

async function saveCompanySettings() {

    if (!currentCompany) {
        alert("Company data is not loaded yet.");
        return;
    }

    // ---------------------------------
    // Save company information
    // ---------------------------------

    const updatedCompany = {
        name: document.getElementById("companySettingsName").value.trim(),
        industry: document.getElementById("companySettingsIndustry").value.trim(),
        email: document.getElementById("companySettingsEmail").value.trim(),
        website: document.getElementById("companySettingsWebsite").value.trim(),
        address: document.getElementById("companySettingsAddress").value.trim(),
        gstin: document.getElementById("companySettingsGstin").value.trim(),
        currency: document.getElementById("companySettingsCurrency").value.trim(),
        brand_color: document.getElementById("companySettingsBrandColor").value,
        timezone: document.getElementById("companySettingsTimezone").value.trim(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await db
        .from("companies")
        .update(updatedCompany)
        .eq("id", currentCompany.id)
        .select()
        .single();

    if (error) {
        console.error("Company update error:", error);
        alert("❌ Failed to save company settings.");
        return;
    }

    currentCompany = data;

    // ---------------------------------
    // Save company contacts
    // ---------------------------------

    for (const contact of companyContacts) {

        const nameInput = document.getElementById(
            `contactName_${contact.id}`
        );

        const phoneInput = document.getElementById(
            `contactPhone_${contact.id}`
        );

        const whatsappInput = document.getElementById(
            `contactWhatsapp_${contact.id}`
        );

        if (!nameInput || !phoneInput || !whatsappInput) {
            continue;
        }

        const updatedContact = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            whatsapp: whatsappInput.value.trim(),
            updated_at: new Date().toISOString()
        };

        const { data: contactData, error: contactError } = await db
            .from("company_contacts")
            .update(updatedContact)
            .eq("id", contact.id)
            .select()
            .single();

        if (contactError) {
            console.error("Contact update error:", contactError);
            alert(`❌ Failed to save ${contact.label}.`);
            return;
        }

        Object.assign(contact, contactData);
    }

    // ---------------------------------
    // Update company name on screen
    // ---------------------------------

    const companyName = document.getElementById("companyName");

    if (companyName) {
        companyName.textContent = currentCompany.name;
    }

    alert("✅ Company settings saved successfully!");

    document.getElementById("profileActionModal")?.remove();
   }
// =====================================
// EDIT EMPLOYEE
// =====================================

window.editEmployee = function(employeeId) {

    const employee = companyEmployees.find(
        emp => Number(emp.id) === Number(employeeId)
    );

    if (!employee) {
        alert("Employee not found.");
        return;
    }

    const modal = document.createElement("div");

    modal.id = "editEmployeeModal";

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:9999;
            padding:20px;
        ">

            <div style="
                background:white;
                width:100%;
                max-width:520px;
                border-radius:16px;
                padding:24px;
                box-shadow:0 20px 50px rgba(0,0,0,.2);
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:20px;
                ">

                    <div>
                        <h2 style="margin:0;">Edit Employee</h2>

                        <small style="color:#6b7280;">
                            Update employee information.
                        </small>
                    </div>

                    <button
                        onclick="document.getElementById('editEmployeeModal')?.remove()"
                        style="
                            border:0;
                            background:none;
                            font-size:22px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>

                </div>

                <div style="
                    display:grid;
                    gap:15px;
                ">

                    <label>
                        Full Name

                        <input
                            id="editEmployeeName"
                            type="text"
                            value="${employee.name || ""}"
                            placeholder="Employee name"
                        >
                    </label>

                    <label>
                        Phone

                        <input
                            id="editEmployeePhone"
                            type="text"
                            value="${employee.phone || ""}"
                            placeholder="Phone number"
                        >
                    </label>

                    <label>
                        Email
                        <input
                            id="editEmployeeEmail"
                            type="email"
                            value="${employee.email || ""}"
                            placeholder="employee@email.com"
                            ${isC1PXOwner(employee) ? "readonly" : ""}
                            ${isC1PXOwner(employee) ? 'style="background:#f3f4f6;cursor:not-allowed;"' : ""}
                        >
                        ${isC1PXOwner(employee) ? '<small style="display:block;margin-top:5px;color:#4b5563;">🔒 Owner email is permanently protected.</small>' : ""}
                    </label>

                    <label>
                        Role

                        ${
                            isC1PXOwner(employee)
                            ? `
                                <input
                                    type="text"
                                    value="Owner"
                                    readonly
                                    style="background:#f3f4f6;cursor:not-allowed;"
                                >
                                <small style="display:block;margin-top:5px;color:#4b5563;">
                                    🔒 Owner role is protected.
                                </small>
                            `
                            : `
                                <select id="editEmployeeRole">
                                    <option value="Employee" ${employee.role === "Employee" ? "selected" : ""}>Employee</option>
                                    <option value="Manager" ${employee.role === "Manager" ? "selected" : ""}>Manager</option>
                                    <option value="Admin" ${employee.role === "Admin" ? "selected" : ""}>Admin</option>
                                </select>
                            `
                        }
                    </label>

                </div>

                <div style="
                    display:flex;
                    justify-content:flex-end;
                    gap:10px;
                    margin-top:22px;
                ">

                    <button
                        class="secondary-btn"
                        onclick="document.getElementById('editEmployeeModal')?.remove()"
                    >
                        Cancel
                    </button>

                    <button
                        class="primary-btn"
                        onclick="saveEditedEmployee(${employee.id})"
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);
};


// =====================================
// SAVE EDITED EMPLOYEE
// =====================================

window.saveEditedEmployee = async function(employeeId) {

    if (!currentCompany) {
        alert("Company data is not loaded.");
        return;
    }

    const name = document
        .getElementById("editEmployeeName")
        .value
        .trim();

    const phone = document
        .getElementById("editEmployeePhone")
        .value
        .trim();

    const email = document
        .getElementById("editEmployeeEmail")
        .value
        .trim();

    const employee = companyEmployees.find(
        emp => Number(emp.id) === Number(employeeId)
    );

    if (!employee) {
        alert("Employee not found.");
        return;
    }

    const protectedOwner = isC1PXOwner(employee);
    const roleInput = document.getElementById("editEmployeeRole");
    const role = protectedOwner
        ? "owner"
        : (roleInput?.value || employee.role || "Employee");

    if (!name) {
        alert("Please enter employee name.");
        return;
    }

    const updatePayload = {
        name: name,
        phone: phone || null
    };

    // Owner email and role are immutable from the CRM.
    if (!protectedOwner) {
        updatePayload.email = email || null;
        updatePayload.role = role;
    } else {
        updatePayload.email = employee.email;
        updatePayload.role = "owner";
    }

    const { data, error } = await db
        .from("employees")
        .update(updatePayload)
        .eq("id", employeeId)
        .eq("company_id", currentCompany.id)
        .select()
        .single();

    if (error) {

        console.error("Employee update error:", error);

        alert("❌ Failed to update employee.");

        return;
    }

    console.log("C1PX Employee Updated:", data);

    alert("✅ Employee updated successfully!");

    document
        .getElementById("editEmployeeModal")
        ?.remove();

    // Reload employees
    await loadCompanyEmployees();

    // Refresh current page
    loadPage("employees");
};

// =====================================
// DELETE EMPLOYEE
// =====================================

window.deleteEmployee = async function(employeeId) {

    const employee = companyEmployees.find(
        emp => Number(emp.id) === Number(employeeId)
    );

    if (!employee) {
        alert("Employee not found.");
        return;
    }

    if (isC1PXOwner(employee)) {
        alert("🔒 The C1PX Owner account is protected and cannot be deleted.");
        return;
    }

    if (!isC1PXAdminOrOwner(currentEmployee)) {
        alert("Only Admin/Owner can delete employees.");
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${employee.name}"?`
    );

    if (!confirmed) {
        return;
    }

    if (!currentCompany) {
        alert("Company data is not loaded.");
        return;
    }

    const { error } = await db
        .from("employees")
        .delete()
        .eq("id", employeeId)
        .eq("company_id", currentCompany.id);

    if (error) {

        console.error("Employee delete error:", error);

        alert("❌ Failed to delete employee.");

        return;
    }

    console.log("C1PX Employee Deleted:", employee);

    alert("✅ Employee deleted successfully!");

    await loadCompanyEmployees();

    loadPage("employees");
};

// =========================================
// C1PX LOGIN SYSTEM
// =========================================

let loginMethod = "email";

window.switchLoginMethod = function (method) {

    loginMethod = method;

    const emailForm = document.getElementById("emailLoginForm");
    const mobileForm = document.getElementById("mobileLoginForm");

    const emailTab = document.getElementById("emailLoginTab");
    const mobileTab = document.getElementById("mobileLoginTab");

    if (method === "email") {

        emailForm.style.display = "block";
        mobileForm.style.display = "none";

        emailTab.classList.add("active");
        mobileTab.classList.remove("active");

    } else {

        emailForm.style.display = "none";
        mobileForm.style.display = "block";

        emailTab.classList.remove("active");
        mobileTab.classList.add("active");

    }
};


// LOGIN
window.loginUser = async function () {

    const password = document
        .getElementById("loginPassword")
        .value
        .trim();

    const message = document.getElementById("loginMessage");
    const button = document.getElementById("loginButton");

    message.textContent = "";

    if (!password) {
        message.textContent = "Please enter your password.";
        return;
    }

    button.disabled = true;
    button.textContent = "Logging in...";

    try {

        let email = "";

        // EMAIL LOGIN
        if (loginMethod === "email") {

            email = document
                .getElementById("loginEmail")
                .value
                .trim();

            if (!email) {
                throw new Error("Please enter your email.");
            }

        }

        // MOBILE LOGIN
        else {

            const mobile = document
                .getElementById("loginMobile")
                .value
                .trim();

            if (!mobile) {
                throw new Error("Please enter your mobile number.");
            }

            const { data: employeeRows, error: employeeError } = await db
                .rpc("c1px_lookup_login_email", { p_phone: mobile });

            const employee = Array.isArray(employeeRows) ? employeeRows[0] : employeeRows;

            if (employeeError || !employee) {
                throw new Error("No employee found with this mobile number.");
            }

            if (!employee.active) {
                throw new Error("This employee account is inactive.");
            }

            if (!employee.login_enabled) {
                throw new Error("Your employee login is disabled.");
            }

            if (!employee.email) {
                throw new Error(
                    "This employee does not have an email linked to the account."
                );
            }

            email = employee.email;
        }

        // SUPABASE LOGIN
        const { data, error } = await db.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            throw error;
        }

        console.log("C1PX Login Successful:", data.user);

        message.textContent = "Login successful.";

        await initializeLoggedInUser(data.user);

    } catch (error) {

        console.error("C1PX Login Error:", error);

        message.textContent =
            error.message || "Login failed.";

    } finally {

        button.disabled = false;
        button.textContent = "Login";
    }
};


// LOAD EMPLOYEE AFTER LOGIN
async function initializeLoggedInUser(user) {

    const { data: employee, error } = await db
        .from("employees")
        .select(`
            *,
            roles:role_id (
                id,
                name,
                permissions
            ),
            companies:company_id (
                id,
                name,
                logo_url,
                brand_color,
                currency,
                timezone
            )
        `)
        .eq("auth_user_id", user.id)
        .single();

    if (error || !employee) {

        console.error(
            "Employee profile loading error:",
            error
        );

        await db.auth.signOut();

        throw new Error(
            "Login account is not connected to an employee."
        );
    }

    if (!employee.active) {

        await db.auth.signOut();

        throw new Error(
            "Your employee account is inactive."
        );
    }
    if (!employee.login_enabled) {
    await db.auth.signOut();
    throw new Error("Your employee login is disabled.");
}

    console.log("C1PX Employee:", employee);
    console.log("C1PX Role:", employee.roles);
    console.log("C1PX Company:", employee.companies);

    // Save current employee
 window.currentEmployee = employee;

updateLoggedInUserUI();

applyRolePermissions();

    // Update last login through a protected server-side RPC.
    const { error: touchLoginError } = await db
        .rpc("c1px_touch_last_login");

    if (touchLoginError) {
        console.warn("C1PX last-login update skipped:", touchLoginError);
    }

    // Hide login screen
    const loginScreen =
        document.getElementById("loginScreen");

    if (loginScreen) {
        loginScreen.style.display = "none";
    }

    // Refresh company information
    if (employee.companies) {
        currentCompany = employee.companies;

        const companyName =
            document.getElementById("companyName");

        if (companyName) {
            companyName.textContent =
                employee.companies.name;
        }
    }

    // Load permanent leads from Supabase before opening the dashboard
    await loadLeads();

    // Open dashboard after leads are loaded
    await loadPage("dashboard");
}

// FORGOT PASSWORD
window.forgotPassword = async function () {

    const emailInput =
        document.getElementById("loginEmail");

    const email =
        emailInput?.value.trim();

    if (!email) {

        alert(
            "Enter your email address first."
        );

        return;
    }

    const { error } =
        await db.auth.resetPasswordForEmail(email);

    if (error) {

        alert(
            "Failed to send password reset email."
        );

        console.error(error);

        return;
    }

    alert(
        "Password reset email sent."
    );
};

// ==========================================
// C1PX - CREATE EMPLOYEE LOGIN
// ==========================================

window.createEmployeeLogin = async function (employeeId) {

    const employee = companyEmployees.find(
        emp => Number(emp.id) === Number(employeeId)
    );

    if (!employee) {
        alert("Employee not found.");
        return;
    }

    if (isC1PXOwner(employee)) {
        alert("🔒 The C1PX Owner login is already protected. Use the Owner account directly.");
        return;
    }

    if (employee.login_enabled || employee.auth_user_id) {
        alert("This employee already has a login account.");
        return;
    }

    if (!isC1PXAdminOrOwner(currentEmployee)) {
        alert("Only Admin/Owner can create employee login accounts.");
        return;
    }

    // Create login modal
    const oldModal = document.getElementById("createLoginModal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.id = "createLoginModal";

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        ">

            <div style="
                width:100%;
                max-width:430px;
                background:#fff;
                border-radius:18px;
                padding:28px;
                box-shadow:0 20px 60px rgba(0,0,0,.25);
            ">

                <h2 style="margin:0 0 6px;">
                    Create Employee Login
                </h2>

                <p style="
                    margin:0 0 22px;
                    color:#64748b;
                    font-size:14px;
                ">
                    ${employee.name || "Employee"}
                </p>

                <label style="display:block;margin-bottom:7px;font-weight:600;">
                    Email Address
                </label>

                <input
                    id="createLoginEmail"
                    type="email"
                    value="${employee.email || ""}"
                    placeholder="employee@email.com"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="display:block;margin-bottom:7px;font-weight:600;">
                    Password
                </label>

                <input
                    id="createLoginPassword"
                    type="password"
                    placeholder="Minimum 6 characters"
                    autocomplete="new-password"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:20px;
                        box-sizing:border-box;
                    "
                >

                <div style="
                    display:flex;
                    gap:10px;
                    justify-content:flex-end;
                ">

                    <button
                        type="button"
                        onclick="closeCreateLoginModal()"
                        class="secondary-btn"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="confirmCreateLoginButton"
                        onclick="confirmCreateEmployeeLogin(${employee.id})"
                        class="primary-btn"
                    >
                        Create Login
                    </button>

                </div>

                <div
                    id="createLoginMessage"
                    style="
                        margin-top:15px;
                        font-size:14px;
                        color:#dc2626;
                    "
                ></div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);
};


// ==========================================
// CLOSE CREATE LOGIN MODAL
// ==========================================

window.closeCreateLoginModal = function () {

    const modal = document.getElementById("createLoginModal");

    if (modal) {
        modal.remove();
    }
};


// ==========================================
// CONFIRM CREATE EMPLOYEE LOGIN
// ==========================================

window.confirmCreateEmployeeLogin = async function (employeeId) {

    const emailInput = document.getElementById("createLoginEmail");
    const passwordInput = document.getElementById("createLoginPassword");
    const message = document.getElementById("createLoginMessage");
    const button = document.getElementById("confirmCreateLoginButton");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    message.textContent = "";

    if (!email) {
        message.textContent = "Please enter an email address.";
        return;
    }

    if (!password || password.length < 6) {
        message.textContent = "Password must be at least 6 characters.";
        return;
    }

    button.disabled = true;
    button.textContent = "Creating...";

    try {

        const {
            data,
            error
        } = await db.functions.invoke(
            "create-employee-login",
            {
                body: {
                    employee_id: employeeId,
                    email: email,
                    password: password
                }
            }
        );

        if (error) {
            console.error("Create Login Function Error:", error);
            throw new Error(error.message || "Failed to create login.");
        }

        if (!data || !data.success) {
            throw new Error(
                data?.error || "Failed to create employee login."
            );
        }

        console.log("C1PX Login Created:", data);

        alert("✅ Employee login created successfully!");

        closeCreateLoginModal();

        await loadCompanyEmployees();

        loadPage("employees");

    } catch (error) {

        console.error("C1PX Create Employee Login Error:", error);

        message.textContent =
            error.message || "Failed to create employee login.";

    } finally {

        button.disabled = false;
        button.textContent = "Create Login";
    }
};

// =====================================================
// C1PX - RESET EMPLOYEE PASSWORD
// =====================================================

window.resetEmployeePassword = async function (employeeId) {

    const employee = companyEmployees.find(
        emp => Number(emp.id) === Number(employeeId)
    );

    if (!employee) {
        alert("Employee not found.");
        return;
    }

    if (isC1PXOwner(employee)) {
        alert("🔒 The C1PX Owner password cannot be changed from the Employees section.");
        return;
    }

    if (!isC1PXAdminOrOwner(currentEmployee)) {
        alert("Only Admin/Owner can reset employee passwords.");
        return;
    }

    if (!employee.login_enabled || !employee.auth_user_id) {
        alert("This employee does not have an active login.");
        return;
    }

    // Remove old modal if already open
    const oldModal = document.getElementById(
        "resetPasswordModal"
    );

    if (oldModal) {
        oldModal.remove();
    }

    const modal = document.createElement("div");

    modal.id = "resetPasswordModal";

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        ">

            <div style="
                width:100%;
                max-width:430px;
                background:#fff;
                border-radius:18px;
                padding:28px;
                box-shadow:0 20px 60px rgba(0,0,0,.25);
            ">

                <h2 style="
                    margin:0 0 6px;
                ">
                    Reset Employee Password
                </h2>

                <p style="
                    margin:0 0 22px;
                    color:#64748b;
                    font-size:14px;
                ">
                    ${employee.name || "Employee"}
                </p>

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    New Password
                </label>

                <input
                    id="resetEmployeePasswordInput"
                    type="password"
                    placeholder="Minimum 6 characters"
                    autocomplete="new-password"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Confirm New Password
                </label>

                <input
                    id="resetEmployeePasswordConfirm"
                    type="password"
                    placeholder="Re-enter new password"
                    autocomplete="new-password"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:20px;
                        box-sizing:border-box;
                    "
                >

                <div style="
                    display:flex;
                    gap:10px;
                    justify-content:flex-end;
                ">

                    <button
                        type="button"
                        onclick="closeResetPasswordModal()"
                        class="secondary-btn"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="confirmResetPasswordButton"
                        onclick="confirmResetEmployeePassword(${employee.id})"
                        class="primary-btn"
                    >
                        Reset Password
                    </button>

                </div>

                <div
                    id="resetPasswordMessage"
                    style="
                        margin-top:15px;
                        font-size:14px;
                        color:#dc2626;
                    "
                ></div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Automatically focus password field
    document
        .getElementById("resetEmployeePasswordInput")
        ?.focus();
};


// Close popup
window.closeResetPasswordModal = function () {

    const modal = document.getElementById(
        "resetPasswordModal"
    );

    if (modal) {
        modal.remove();
    }
};


// Confirm password reset
window.confirmResetEmployeePassword = async function (
    employeeId
) {

    const passwordInput =
        document.getElementById(
            "resetEmployeePasswordInput"
        );

    const confirmInput =
        document.getElementById(
            "resetEmployeePasswordConfirm"
        );

    const message =
        document.getElementById(
            "resetPasswordMessage"
        );

    const button =
        document.getElementById(
            "confirmResetPasswordButton"
        );

    const newPassword =
        passwordInput.value;

    const confirmPassword =
        confirmInput.value;

    message.textContent = "";

    // Validation
    if (!newPassword) {

        message.textContent =
            "Please enter a new password.";

        return;
    }

    if (newPassword.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }

    if (newPassword !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }

    button.disabled = true;
    button.textContent = "Resetting...";

    try {

        const {
            data,
            error
        } = await db.functions.invoke(
            "hyper-function",
            {
                body: {
                    employee_id: employeeId,
                    new_password: newPassword
                }
            }
        );

        if (error) {

            console.error(
                "Reset Password Function Error:",
                error
            );

            throw new Error(
                error.message ||
                "Failed to reset password."
            );
        }

        if (!data || !data.success) {

            throw new Error(
                data?.error ||
                "Failed to reset employee password."
            );
        }

        console.log(
            "C1PX Password Reset:",
            data
        );

        alert(
            "✅ Employee password reset successfully!"
        );

        closeResetPasswordModal();

    } catch (error) {

        console.error(
            "C1PX Reset Employee Password Error:",
            error
        );

        message.textContent =
            error.message ||
            "Failed to reset password.";

    } finally {

        button.disabled = false;
        button.textContent = "Reset Password";
    }
};

// =====================================================
// C1PX - ENABLE / DISABLE EMPLOYEE LOGIN
// =====================================================

window.toggleEmployeeLogin = async function (employeeId) {

    const employee = companyEmployees.find(
        emp => Number(emp.id) === Number(employeeId)
    );

    if (!employee) {
        alert("Employee not found.");
        return;
    }

    if (isC1PXOwner(employee)) {
        alert("🔒 The C1PX Owner login cannot be disabled.");
        return;
    }

    if (!isC1PXAdminOrOwner(currentEmployee)) {
        alert("Only Admin/Owner can enable or disable employee login.");
        return;
    }

    if (!employee.auth_user_id) {
        alert("This employee does not have a login account.");
        return;
    }

    const newStatus = !employee.login_enabled;

    const action = newStatus
        ? "enable"
        : "disable";

    const confirmed = confirm(
        `Are you sure you want to ${action} login for "${employee.name}"?`
    );

    if (!confirmed) return;

    const { error } = await db
        .from("employees")
        .update({
            login_enabled: newStatus
        })
        .eq("id", employeeId)
        .eq("company_id", currentCompany.id);

    if (error) {

        console.error(
            "Employee login status update error:",
            error
        );

        alert(
            "❌ Failed to update employee login status."
        );

        return;
    }

    alert(
        newStatus
            ? "✅ Employee login enabled."
            : "🔴 Employee login disabled."
    );

    await loadCompanyEmployees();

    loadPage("employees");
};

// =====================================================
// C1PX - UPDATE LOGGED-IN USER UI
// =====================================================

function updateLoggedInUserUI() {

    const employee = window.currentEmployee;

    if (!employee) {
        console.warn("C1PX: No logged-in employee found.");
        return;
    }

    const name = employee.name || "User";

    const normalizedRole = String(employee.role || "").toLowerCase();
    const role =
        normalizedRole === "admin"
            ? "Administrator"
            : normalizedRole === "owner"
                ? "Owner"
                : (employee.role || "Employee");

    const initials = name
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

    console.log("C1PX UI UPDATE:", {
        name,
        role,
        initials,
        employee
    });

    // =========================
    // TOP PROFILE BUTTON
    // =========================

    const profileName =
        document.getElementById("profileName");

    const profileAvatar =
        document.getElementById("profileAvatar");

    if (profileName) {
        profileName.textContent = name;
    }

    if (profileAvatar) {
        profileAvatar.textContent = initials;
    }

    // =========================
    // PROFILE DROPDOWN
    // =========================

    const sidebarName =
        document.getElementById("sidebarName");

    const sidebarRole =
        document.getElementById("sidebarRole");

    const sidebarAvatar =
        document.getElementById("sidebarAvatar");

    if (sidebarName) {
        sidebarName.textContent = name;
    }

    if (sidebarRole) {
        sidebarRole.textContent = role;
    }

    if (sidebarAvatar) {
        sidebarAvatar.textContent = initials;
    }

    // =========================
    // UPDATE SIDEBAR FOOTER
    // =========================

    const footerName =
        document.getElementById("footerName");

    const footerRole =
        document.getElementById("footerRole");

    const footerAvatar =
        document.getElementById("footerAvatar");

    if (footerName) {
        footerName.textContent = name;
    }

    if (footerRole) {
        footerRole.textContent = role;
    }

    if (footerAvatar) {
        footerAvatar.textContent = initials;
    }

    // =========================
    // FORCE PROFILE DROPDOWN
    // =========================

    setTimeout(() => {

        const nameEl =
            document.getElementById("sidebarName");

        const roleEl =
            document.getElementById("sidebarRole");

        const avatarEl =
            document.getElementById("sidebarAvatar");

        if (nameEl) {
            nameEl.textContent = name;
        }

        if (roleEl) {
            roleEl.textContent = role;
        }

        if (avatarEl) {
            avatarEl.textContent = initials;
        }

    }, 100);
}

// =====================================================
// C1PX - ROLE PERMISSION HELPER
// =====================================================

function hasPermission(permission) {

    const employee = window.currentEmployee;

    if (!employee) {
        return false;
    }

    // =====================================================
    // C1PX CRM
    // ALL LOGGED-IN EMPLOYEES HAVE FULL CRM MODULE ACCESS
    // =====================================================

    return true;
}

const modulePermissions = {

    dashboard: null,

    leads: "leads",

    customers: "customers",

    followups: "followups",

    visits: "site_visits",

    projects: "projects",

    properties: "properties",

    employees: "employees",

    reports: "reports",

    activity: "activity",

    "birthday-settings": "greetings"

};

function applyRolePermissions() {

    const employee = window.currentEmployee;

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            const page = button.dataset.page;

            // =================================================
            // EMPLOYEES MODULE = ADMIN ONLY
            // =================================================
            if (page === "employees") {

                if (isC1PXAdminOrOwner(employee)) {
                    button.style.display = "";
                } else {
                    button.style.display = "none";
                }

                return;
            }

            // =================================================
            // ALL OTHER CRM MODULES = AVAILABLE TO EVERYONE
            // =================================================
            button.style.display = "";
        });
}

// =====================================================
// C1PX - EDIT SITE VISIT
// =====================================================

window.editSiteVisit = async function (visitId) {

    const { data: visit, error } = await db
        .from("site_visits")
        .select("*")
        .eq("id", visitId)
        .single();

    if (error || !visit) {
        console.error("Edit Site Visit Error:", error);
        alert("❌ Could not load site visit.");
        return;
    }

    const oldModal =
        document.getElementById("editSiteVisitModal");

    if (oldModal) {
        oldModal.remove();
    }

    const modal = document.createElement("div");

    modal.id = "editSiteVisitModal";

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        ">

            <div style="
                width:100%;
                max-width:500px;
                background:#fff;
                border-radius:18px;
                padding:28px;
                box-shadow:0 20px 60px rgba(0,0,0,.25);
            ">

                <h2 style="margin:0 0 6px;">
                    Edit Site Visit
                </h2>

                <p style="
                    margin:0 0 22px;
                    color:#64748b;
                    font-size:14px;
                ">
                    Update the customer's visit details
                </p>

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Visit Date
                </label>

                <input
                    id="editVisitDate"
                    type="date"
                    value="${visit.visit_date || ""}"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Visit Time
                </label>

                <input
                    id="editVisitTime"
                    type="time"
                    value="${visit.visit_time || ""}"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Assigned To
                </label>

                <input
                    id="editVisitEmployee"
                    type="text"
                    value="${visit.employee || visit.assigned_to || ""}"
                    placeholder="Employee name"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Status
                </label>

                <select
                    id="editVisitStatus"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >
                    <option value="Scheduled"
                        ${visit.status === "Scheduled" ? "selected" : ""}>
                        Scheduled
                    </option>

                    <option value="Completed"
                        ${visit.status === "Completed" ? "selected" : ""}>
                        Completed
                    </option>

                    <option value="Cancelled"
                        ${visit.status === "Cancelled" ? "selected" : ""}>
                        Cancelled
                    </option>

                    <option value="Rescheduled"
                        ${visit.status === "Rescheduled" ? "selected" : ""}>
                        Rescheduled
                    </option>
                </select>

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Notes
                </label>

                <textarea
                    id="editVisitNotes"
                    placeholder="Enter notes"
                    style="
                        width:100%;
                        min-height:90px;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:20px;
                        box-sizing:border-box;
                        resize:vertical;
                    "
                >${visit.notes || ""}</textarea>

                <div style="
                    display:flex;
                    gap:10px;
                    justify-content:flex-end;
                ">

                    <button
                        type="button"
                        onclick="closeEditSiteVisit()"
                        class="secondary-btn"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="saveEditedVisitButton"
                        onclick="saveEditedSiteVisit('${visit.id}')"
                        class="primary-btn"
                    >
                        Save Changes
                    </button>

                </div>

                <div
                    id="editSiteVisitMessage"
                    style="
                        margin-top:15px;
                        font-size:14px;
                        color:#dc2626;
                    "
                ></div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);
};


// Close Edit popup
window.closeEditSiteVisit = function () {

    const modal =
        document.getElementById("editSiteVisitModal");

    if (modal) {
        modal.remove();
    }
};


// Save edited Site Visit
window.saveEditedSiteVisit = async function (visitId) {

    const date =
        document.getElementById("editVisitDate").value;

    const time =
        document.getElementById("editVisitTime").value;

    const employee =
        document.getElementById("editVisitEmployee").value.trim();

    const status =
        document.getElementById("editVisitStatus").value;

    const notes =
        document.getElementById("editVisitNotes").value.trim();

    const message =
        document.getElementById("editSiteVisitMessage");

    const button =
        document.getElementById("saveEditedVisitButton");

    if (!date) {
        message.textContent =
            "Please select visit date.";
        return;
    }

    if (!time) {
        message.textContent =
            "Please select visit time.";
        return;
    }

    button.disabled = true;
    button.textContent = "Saving...";

    try {

        const { error } = await db
            .from("site_visits")
            .update({
                visit_date: date,
                visit_time: time,
                employee: employee || null,
                status: status,
                notes: notes || null
            })
            .eq("id", visitId);

        if (error) {
            console.error(
                "Update Site Visit Error:",
                error
            );

            throw error;
        }

        alert("✅ Site visit updated successfully!");

        closeEditSiteVisit();

        // Immediately refresh table
        renderSiteVisitRows();

    } catch (error) {

        console.error(
            "C1PX Edit Site Visit Error:",
            error
        );

        message.textContent =
            error.message ||
            "Failed to update site visit.";

    } finally {

        button.disabled = false;
        button.textContent = "Save Changes";
    }
};

// =====================================================
// C1PX - ADD PROPERTY PHASE
// =====================================================

window.openAddPhaseModal = function () {

    const oldModal = document.getElementById("addPhaseModal");

    if (oldModal) {
        oldModal.remove();
    }

    const modal = document.createElement("div");

    modal.id = "addPhaseModal";

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(15,23,42,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        ">

            <div style="
                width:100%;
                max-width:460px;
                background:#fff;
                border-radius:18px;
                padding:28px;
                box-shadow:0 20px 60px rgba(0,0,0,.25);
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:22px;
                ">

                    <div>
                        <span class="eyebrow">
                            PROPERTY INVENTORY
                        </span>

                        <h2 style="margin:5px 0 0;">
                            Add New Phase
                        </h2>
                    </div>

                    <button
                        type="button"
                        onclick="closeAddPhaseModal()"
                        style="
                            border:0;
                            background:#f1f5f9;
                            width:36px;
                            height:36px;
                            border-radius:10px;
                            font-size:20px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>

                </div>

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Project Name
                </label>

                <input
                    id="newPhaseProject"
                    type="text"
                    value="Dayal Dev Park"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Phase Name
                </label>

                <input
                    id="newPhaseName"
                    type="text"
                    placeholder="Example: Phase 4"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Total Plots
                </label>

                <input
                    id="newPhasePlots"
                    type="number"
                    min="1"
                    placeholder="Example: 50"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Phase Status
                </label>

                <select
                    id="newPhaseStatus"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:20px;
                        box-sizing:border-box;
                    "
                >
                    <option value="Coming Soon">
                        Coming Soon
                    </option>

                    <option value="Selling Now">
                        Selling Now
                    </option>

                    <option value="Completed">
                        Completed
                    </option>
                </select>

                <div style="
                    display:flex;
                    gap:10px;
                    justify-content:flex-end;
                ">

                    <button
                        type="button"
                        onclick="closeAddPhaseModal()"
                        class="secondary-btn"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="savePhaseButton"
                        onclick="saveNewPhase()"
                        class="primary-btn"
                    >
                        Add Phase
                    </button>

                </div>

                <div
                    id="addPhaseMessage"
                    style="
                        margin-top:14px;
                        font-size:14px;
                        color:#dc2626;
                    "
                ></div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document
        .getElementById("newPhaseName")
        ?.focus();
};


window.closeAddPhaseModal = function () {

    const modal =
        document.getElementById("addPhaseModal");

    if (modal) {
        modal.remove();
    }
};


window.saveNewPhase = async function () {

    const project =
        document.getElementById("newPhaseProject")
            .value.trim();

    const phase =
        document.getElementById("newPhaseName")
            .value.trim();

    const totalPlots =
        Number(
            document.getElementById("newPhasePlots")
                .value
        );

    const status =
        document.getElementById("newPhaseStatus")
            .value;

    const message =
        document.getElementById("addPhaseMessage");

    const button =
        document.getElementById("savePhaseButton");


    if (!currentCompany) {
        await loadCompany();
    }

    if (!currentCompany) {
        message.textContent =
            "Company information could not be loaded.";
        return;
    }


    if (!project) {
        message.textContent =
            "Please enter project name.";
        return;
    }


    if (!phase) {
        message.textContent =
            "Please enter phase name.";
        return;
    }


    if (!totalPlots || totalPlots < 1) {
        message.textContent =
            "Please enter a valid number of plots.";
        return;
    }


    button.disabled = true;
    button.textContent = "Adding...";


    try {

        const { data, error } = await db
            .from("property_phases")
            .insert([
                {
                    company_id: currentCompany.id,
                    project_name: project,
                    phase_name: phase,
                    total_plots: totalPlots,
                    status: status
                }
            ])
            .select()
            .single();


        if (error) {

            console.error(
                "C1PX Add Phase Error:",
                error
            );

            throw new Error(error.message);
        }


        console.log(
            "C1PX Phase Added:",
            data
        );


        alert(
    "✅ Phase added successfully!"
);

// Add the newly created phase immediately
if (data) {
    propertyPhases.push(data);
}

closeAddPhaseModal();

   // Refresh the Properties page immediately
appContent.innerHTML = propertiesHTML();
bindPageEvents();


    } catch (error) {

        console.error(
            "C1PX Save Phase Error:",
            error
        );

        message.textContent =
            error.message ||
            "Failed to add phase.";

    } finally {

        button.disabled = false;
        button.textContent = "Add Phase";
    }
};

window.editPropertyPhase = function (phaseId) {

    const phase = propertyPhases.find(
        p => String(p.id) === String(phaseId)
    );

    if (!phase) {
        alert("Phase not found.");
        return;
    }

    if (!currentEmployee || currentEmployee.role !== "Admin") {
        alert("Only Admin can edit phases.");
        return;
    }

    const oldModal = document.getElementById("editPhaseModal");

    if (oldModal) {
        oldModal.remove();
    }

    const modal = document.createElement("div");

    modal.id = "editPhaseModal";

    modal.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        ">

            <div style="
                width:100%;
                max-width:430px;
                background:#fff;
                border-radius:18px;
                padding:28px;
                box-shadow:0 20px 60px rgba(0,0,0,.25);
            ">

                <h2 style="margin:0 0 6px;">
                    Edit Phase
                </h2>

                <p style="
                    margin:0 0 22px;
                    color:#64748b;
                    font-size:14px;
                ">
                    ${phase.project_name || "Project"}
                </p>

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Phase Name
                </label>

                <input
                    id="editPhaseName"
                    type="text"
                    value="${phase.phase_name || ""}"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Total Plots
                </label>

                <input
                    id="editPhasePlots"
                    type="number"
                    min="1"
                    value="${Number(phase.total_plots || 0)}"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:16px;
                        box-sizing:border-box;
                    "
                >

                <label style="
                    display:block;
                    margin-bottom:7px;
                    font-weight:600;
                ">
                    Status
                </label>

                <select
                    id="editPhaseStatus"
                    style="
                        width:100%;
                        padding:12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        margin-bottom:20px;
                        box-sizing:border-box;
                    "
                >
                    <option value="Coming Soon"
                        ${phase.status === "Coming Soon" ? "selected" : ""}>
                        Coming Soon
                    </option>

                    <option value="Selling Now"
                        ${phase.status === "Selling Now" ? "selected" : ""}>
                        Selling Now
                    </option>

                    <option value="Completed"
                        ${phase.status === "Completed" ? "selected" : ""}>
                        Completed
                    </option>
                </select>

                <div style="
                    display:flex;
                    gap:10px;
                    justify-content:flex-end;
                ">

                    <button
                        type="button"
                        onclick="closeEditPhaseModal()"
                        class="secondary-btn"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="saveEditedPhaseButton"
                        onclick="saveEditedPropertyPhase('${phase.id}')"
                        class="primary-btn"
                    >
                        Save Changes
                    </button>

                </div>

                <div
                    id="editPhaseMessage"
                    style="
                        margin-top:15px;
                        font-size:14px;
                        color:#dc2626;
                    "
                ></div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document
        .getElementById("editPhaseName")
        ?.focus();
};


window.closeEditPhaseModal = function () {

    const modal = document.getElementById("editPhaseModal");

    if (modal) {
        modal.remove();
    }
};

window.deletePropertyPhase = async function (phaseId) {

    if (!currentEmployee || currentEmployee.role !== "Admin") {
        alert("Only Admin can delete phases.");
        return;
    }

    if (!currentCompany) {
        await loadCompany();
    }

    if (!currentCompany) {
        alert("Company information could not be loaded.");
        return;
    }

    const phase = propertyPhases.find(
        p => String(p.id) === String(phaseId)
    );

    if (!phase) {
        alert("Phase not found.");
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${phase.phase_name}"?`
    );

    if (!confirmed) {
        return;
    }

    try {

        const { error } = await db
            .from("property_phases")
            .delete()
            .eq("id", phaseId)
            .eq("company_id", currentCompany.id);

        if (error) {
            console.error(
                "C1PX Delete Phase Error:",
                error
            );

            throw new Error(error.message);
        }

        alert("✅ Phase deleted successfully!");

        await loadPropertyPhases();

        loadPage("properties");

    } catch (error) {

        console.error(
            "C1PX Delete Phase Error:",
            error
        );

        alert(
            error.message ||
            "Failed to delete phase."
        );
    }
};

// =====================================================
// C1PX - RESTORE SUPABASE SESSION ON PAGE REFRESH
// =====================================================

async function restoreC1PXSession() {

    try {

        const { data, error } = await db.auth.getSession();

        if (error) {
            console.error("C1PX Session Restore Error:", error);
            return;
        }

        const session = data?.session;

        if (!session?.user) {
            const loginScreen = document.getElementById("loginScreen");
            if (loginScreen) loginScreen.style.display = "flex";
            return;
        }

        await initializeLoggedInUser(session.user);

    } catch (error) {

        console.error("C1PX Session Initialization Error:", error);

        const loginScreen = document.getElementById("loginScreen");
        if (loginScreen) loginScreen.style.display = "flex";
    }
}

restoreC1PXSession();

// =====================================================
// C1PX DYNAMIC PROPERTY MANAGEMENT v1
// Project -> Phase -> Plot, permanently stored in Supabase.
// Existing legacy arrays remain available for migration/fallback.
// =====================================================

let c1pxProjects = [];
let c1pxDynamicPlots = [];

async function loadC1PXProjects() {
    if (!currentCompany) return;

    const { data, error } = await db
        .from("c1px_projects")
        .select("*")
        .eq("company_id", currentCompany.id)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("C1PX project loading error:", error);
        return;
    }

    c1pxProjects = data || [];

    // Existing phases are the source of truth for any legacy project that
    // was not yet present in c1px_projects.
    const known = new Set(c1pxProjects.map(p => String(p.name).trim().toLowerCase()));
    const missing = [];
    (propertyPhases || []).forEach(phase => {
        const name = String(phase.project_name || "").trim();
        if (name && !known.has(name.toLowerCase())) {
            missing.push({ company_id: currentCompany.id, name, status: "Active" });
            known.add(name.toLowerCase());
        }
    });

    if (missing.length) {
        const { data: seeded, error: seedError } = await db
            .from("c1px_projects")
            .upsert(missing, { onConflict: "company_id,name" })
            .select();
        if (seedError) {
            console.error("C1PX project seed error:", seedError);
        } else if (seeded) {
            c1pxProjects = [...c1pxProjects, ...seeded];
        }
    }
}

function getDynamicProjectNames() {
    const names = new Set((c1pxProjects || []).map(p => String(p.name || "").trim()).filter(Boolean));
    (propertyPhases || []).forEach(p => {
        if (p.project_name) names.add(String(p.project_name).trim());
    });
    return [...names];
}

function escapeAttr(value) {
    return escapeHtml(String(value ?? "")).replace(/'/g, "&#39;");
}

async function loadC1PXDynamicPlots() {
    if (!currentCompany) return;
    const { data, error } = await db
        .from("property_plots")
        .select("*")
        .eq("company_id", currentCompany.id)
        .order("project_name", { ascending: true })
        .order("phase_name", { ascending: true })
        .order("plot_number", { ascending: true });
    if (error) {
        console.error("C1PX dynamic plots loading error:", error);
        return;
    }
    c1pxDynamicPlots = data || [];
}

function dynamicPlotToUI(row) {
    return {
        id: row.id,
        plotNumber: Number(row.plot_number),
        project: row.project_name,
        phase: row.phase_name,
        areaSqM: Number(row.area_sq_m || 0),
        areaSqFt: Number(row.area_sq_ft || 0),
        status: row.status || "Available",
        customerName: row.customer_name || "",
        customerPhone: row.customer_phone || "",
        assignedEmployee: row.assigned_employee || "",
        visitDate: row.visit_date || "",
        holdUntil: row.hold_until || "",
        followUpDate: row.follow_up_date || "",
        notes: row.notes || ""
    };
}

function getDynamicPlotsForPhase(project, phase) {
    return c1pxDynamicPlots
        .filter(p => p.project_name === project && p.phase_name === phase)
        .sort((a,b) => Number(a.plot_number) - Number(b.plot_number));
}

function propertyStatusStyle(status) {
    const styles = {
        Sold: ["#fee2e2", "#b91c1c"],
        Available: ["#dcfce7", "#15803d"],
        "On Hold": ["#fef3c7", "#b45309"],
        Pipeline: ["#dbeafe", "#1d4ed8"],
        "Site Visit": ["#ede9fe", "#6d28d9"]
    };
    return styles[status] || ["#f1f5f9", "#475569"];
}

function dynamicProjectCard(project) {
    const phases = propertyPhases.filter(p => String(p.project_name).trim() === project);
    const total = phases.reduce((n,p) => n + Number(p.total_plots || 0), 0);
    return `
        <section class="panel" style="margin-bottom:18px;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:15px;flex-wrap:wrap;">
                <div>
                    <h3 style="margin:0;">${escapeHtml(project)}</h3>
                    <p class="muted" style="margin:5px 0 0;">Project Inventory</p>
                </div>
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                    <div style="font-size:14px;font-weight:600;">Total Project Plots: <span style="font-size:20px;">${total}</span></div>
                    ${currentEmployee?.role === "Admin" ? `<button class="secondary-btn" onclick="editC1PXProject('${escapeAttr(c1pxProjects.find(p => p.name === project)?.id || "")}')">Edit Project</button><button class="secondary-btn" onclick="deleteC1PXProject('${escapeAttr(c1pxProjects.find(p => p.name === project)?.id || "")}')" style="color:#dc2626;">Delete Project</button>` : ""}
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin-top:18px;">
                ${phases.map(phase => {
                    const status = phase.status || "Coming Soon";
                    const plots = getDynamicPlotsForPhase(project, phase.phase_name);
                    const statusStyle = status === "Selling Now" ? ["#dcfce7","#15803d"] : status === "Completed" ? ["#f1f5f9","#64748b"] : ["#fef3c7","#b45309"];
                    return `
                        <div style="padding:18px;border:1px solid #e5e7eb;border-radius:14px;position:relative;background:#fff;">
                            <div style="font-size:13px;color:#6b7280;text-transform:uppercase;">${escapeHtml(phase.phase_name || "Unnamed Phase")}</div>
                            <div style="font-size:25px;font-weight:700;margin:5px 0;">${Number(phase.total_plots || 0)} Plots</div>
                            <span style="background:${statusStyle[0]};color:${statusStyle[1]};padding:5px 9px;border-radius:20px;font-size:12px;font-weight:700;">${escapeHtml(status)}</span>
                            <div style="font-size:12px;color:#64748b;margin-top:8px;">Database plots: ${plots.length}</div>
                            <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
                                <button class="secondary-btn" onclick="openPropertyPlots('${escapeAttr(project)}','${escapeAttr(phase.phase_name)}','${phase.id}')" style="padding:8px 12px;font-size:13px;">Open Plots</button>
                                ${currentEmployee?.role === "Admin" ? `<button class="secondary-btn" onclick="editPropertyPhase('${phase.id}')" style="padding:8px 12px;font-size:13px;">Edit Phase</button><button class="secondary-btn" onclick="deletePropertyPhase('${phase.id}')" style="padding:8px 12px;font-size:13px;color:#dc2626;">Delete</button>` : ""}
                            </div>
                        </div>`;
                }).join("")}
            </div>
        </section>`;
}

// Replace the old Properties landing page with a fully dynamic project view.
function propertiesHTML() {
    const projects = getDynamicProjectNames();
    return `
        <div class="page-toolbar">
            <div>
                <span class="eyebrow">PROPERTY INVENTORY</span>
                <h3>Properties</h3>
                <p class="muted">Company → Project → Phase → Plot. All plot records are permanently stored in C1PX.</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${currentEmployee?.role === "Admin" ? `<button class="secondary-btn" onclick="openAddProjectModal()">+ Add Project</button>` : ""}
                <button class="primary-btn" onclick="openAddPhaseModal()">+ Add Phase</button>
            </div>
        </div>
        ${projects.length ? projects.map(dynamicProjectCard).join("") : `<section class="panel"><div style="padding:30px;text-align:center;color:#6b7280;">No projects added yet.</div></section>`}
    `;
}

window.openAddProjectModal = function() {
    if (currentEmployee?.role !== "Admin") return alert("Only Admin can add projects.");
    document.getElementById("c1pxAddProjectModal")?.remove();
    const modal = document.createElement("div");
    modal.id = "c1pxAddProjectModal";
    modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;">
        <div style="width:100%;max-width:500px;background:#fff;border-radius:18px;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,.25);">
          <h2 style="margin:0 0 6px;">Add Project</h2><p class="muted" style="margin:0 0 20px;">Create a project before adding phases and plots.</p>
          <label style="display:block;font-weight:600;margin-bottom:7px;">Project Name</label>
          <input id="c1pxProjectName" placeholder="e.g. Hans Residency" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #d1d5db;border-radius:10px;margin-bottom:14px;">
          <label style="display:block;font-weight:600;margin-bottom:7px;">Location</label>
          <input id="c1pxProjectLocation" placeholder="Project location" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #d1d5db;border-radius:10px;margin-bottom:14px;">
          <label style="display:block;font-weight:600;margin-bottom:7px;">Description</label>
          <textarea id="c1pxProjectDescription" rows="3" placeholder="Short description" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #d1d5db;border-radius:10px;margin-bottom:18px;"></textarea>
          <div style="display:flex;gap:10px;justify-content:flex-end;"><button class="secondary-btn" onclick="document.getElementById('c1pxAddProjectModal')?.remove()">Cancel</button><button id="c1pxSaveProjectBtn" class="primary-btn" onclick="saveC1PXProject()">Create Project</button></div>
          <div id="c1pxProjectMsg" style="margin-top:12px;color:#dc2626;font-size:14px;"></div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById("c1pxProjectName")?.focus();
};

window.saveC1PXProject = async function() {
    if (!currentCompany || currentEmployee?.role !== "Admin") return alert("Only Admin can create projects.");
    const name = document.getElementById("c1pxProjectName").value.trim();
    const location = document.getElementById("c1pxProjectLocation").value.trim();
    const description = document.getElementById("c1pxProjectDescription").value.trim();
    const msg = document.getElementById("c1pxProjectMsg");
    if (!name) return msg.textContent = "Please enter project name.";
    const btn = document.getElementById("c1pxSaveProjectBtn"); btn.disabled = true; btn.textContent = "Creating...";
    const { data, error } = await db.from("c1px_projects").insert({ company_id: currentCompany.id, name, location: location || null, description: description || null, status: "Active" }).select().single();
    if (error) { msg.textContent = error.message; btn.disabled = false; btn.textContent = "Create Project"; return; }
    c1pxProjects.push(data);
    document.getElementById("c1pxAddProjectModal")?.remove();
    loadPage("properties");
};

window.editC1PXProject = async function(projectId) {
    if (currentEmployee?.role !== "Admin") return alert("Only Admin can edit projects.");
    const project = c1pxProjects.find(p => String(p.id) === String(projectId));
    if (!project) return alert("Project not found.");
    const name = prompt("Project name:", project.name);
    if (name === null) return;
    const clean = name.trim(); if (!clean) return alert("Project name is required.");
    const { data, error } = await db.from("c1px_projects").update({ name: clean, updated_at: new Date().toISOString() }).eq("id", project.id).eq("company_id", currentCompany.id).select().single();
    if (error) return alert(error.message);
    const old = project.name;
    c1pxProjects = c1pxProjects.map(p => p.id === project.id ? data : p);
    // Keep legacy phase names consistent with the renamed project.
    await db.from("property_phases").update({ project_name: clean, updated_at: new Date().toISOString() }).eq("company_id", currentCompany.id).eq("project_name", old);
    await loadPropertyPhases();
    await loadC1PXDynamicPlots();
    loadPage("properties");
};

window.deleteC1PXProject = async function(projectId) {
    if (currentEmployee?.role !== "Admin") return alert("Only Admin can delete projects.");
    const project = c1pxProjects.find(p => String(p.id) === String(projectId));
    if (!project) return alert("Project not found.");
    const phases = propertyPhases.filter(p => p.project_name === project.name);
    if (phases.length) return alert("This project still has phases. Delete its phases first, then delete the project.");
    if (!confirm(`Delete project "${project.name}"?`)) return;
    const { error } = await db.from("c1px_projects").delete().eq("id", project.id).eq("company_id", currentCompany.id);
    if (error) return alert(error.message);
    c1pxProjects = c1pxProjects.filter(p => p.id !== project.id);
    loadPage("properties");
};

// Dynamic phase creation: also creates the requested number of permanent plot records.
window.saveNewPhase = async function() {
    const project = document.getElementById("newPhaseProject")?.value.trim();
    const phase = document.getElementById("newPhaseName")?.value.trim();
    const totalPlots = Number(document.getElementById("newPhasePlots")?.value);
    const status = document.getElementById("newPhaseStatus")?.value || "Coming Soon";
    const message = document.getElementById("addPhaseMessage");
    const button = document.getElementById("savePhaseButton");
    if (!currentCompany) await loadCompany();
    if (!project) return message.textContent = "Please enter project name.";
    if (!phase) return message.textContent = "Please enter phase name.";
    if (!Number.isInteger(totalPlots) || totalPlots < 1 || totalPlots > 10000) return message.textContent = "Enter a valid plot count (1–10,000).";
    button.disabled = true; button.textContent = "Adding...";
    try {
        const { data: phaseRow, error: phaseError } = await db.from("property_phases").insert({ company_id: currentCompany.id, project_name: project, phase_name: phase, total_plots: totalPlots, status }).select().single();
        if (phaseError) throw phaseError;
        const rows = Array.from({length: totalPlots}, (_, i) => ({ company_id: currentCompany.id, project_name: project, phase_name: phase, plot_number: i + 1, area_sq_m: 0, area_sq_ft: 0, status: "Available" }));
        const { error: plotError } = await db.from("property_plots").upsert(rows, { onConflict: "company_id,project_name,phase_name,plot_number", ignoreDuplicates: true });
        if (plotError) throw plotError;
        // Ensure a project record exists.
        const { data: projectRow } = await db.from("c1px_projects").upsert({ company_id: currentCompany.id, name: project, status: "Active" }, { onConflict: "company_id,name" }).select().single();
        if (projectRow && !c1pxProjects.some(p => p.id === projectRow.id)) c1pxProjects.push(projectRow);
        propertyPhases.push(phaseRow);
        closeAddPhaseModal();
        await loadC1PXDynamicPlots();
        loadPage("properties");
    } catch (error) {
        console.error("C1PX dynamic phase creation error:", error);
        message.textContent = error.message || "Failed to add phase.";
    } finally { button.disabled = false; button.textContent = "Add Phase"; }
};

window.openPropertyPlots = function(project, phase, phaseId) {
    const plots = getDynamicPlotsForPhase(project, phase).map(dynamicPlotToUI);
    const sourcePlots = plots.length ? plots : getAllPropertyPlots().filter(p => p.project === project && p.phase === phase);
    if (!sourcePlots.length) return alert(`No individual plot data found for ${project} • ${phase}.`);
    appContent.innerHTML = `
      <div style="padding:24px;">
        <button class="secondary-btn" onclick="loadPage('properties')" style="margin-bottom:20px;">← Back to Properties</button>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:15px;flex-wrap:wrap;">
          <div><span class="eyebrow">PROPERTY INVENTORY</span><h2 style="margin:6px 0;">${escapeHtml(project)}</h2><p class="muted">${escapeHtml(phase)} • ${sourcePlots.length} Plots</p></div>
          <button class="primary-btn" onclick="openAddPropertyPlotsModal('${escapeAttr(project)}','${escapeAttr(phase)}')">+ Add Plots</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:18px 0;">
          <input id="dynamicPlotSearch" placeholder="Search plot, customer, phone..." style="padding:11px;border:1px solid #d1d5db;border-radius:10px;">
          <select id="dynamicPlotFilter" style="padding:11px;border:1px solid #d1d5db;border-radius:10px;"><option>All</option><option>Available</option><option>On Hold</option><option>Sold</option><option>Pipeline</option><option>Site Visit</option></select>
          <select id="dynamicPlotEmployeeFilter" style="padding:11px;border:1px solid #d1d5db;border-radius:10px;"><option value="">All Employees</option>${(companyEmployees || []).map(e => `<option value="${escapeAttr(e.name)}">${escapeHtml(e.name)}</option>`).join("")}</select>
        </div>
        <div id="dynamicPlotGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;"></div>
      </div>`;
    const render = () => {
        const q = (document.getElementById("dynamicPlotSearch")?.value || "").trim().toLowerCase();
        const f = document.getElementById("dynamicPlotFilter")?.value || "All";
        const ef = document.getElementById("dynamicPlotEmployeeFilter")?.value || "";
        const list = sourcePlots.filter(p => (f === "All" || p.status === f) && (!ef || p.assignedEmployee === ef) && (!q || `${p.plotNumber} ${p.customerName} ${p.customerPhone} ${p.notes}`.toLowerCase().includes(q)));
        document.getElementById("dynamicPlotGrid").innerHTML = list.map(plot => {
            const [bg,color] = propertyStatusStyle(plot.status);
            return `<div style="border:1px solid #e5e7eb;border-radius:14px;padding:16px;background:#fff;"><div style="display:flex;justify-content:space-between;align-items:center;"><strong style="font-size:20px;">Plot ${plot.plotNumber}</strong><span style="background:${bg};color:${color};padding:5px 9px;border-radius:20px;font-size:12px;font-weight:700;">${escapeHtml(plot.status)}</span></div><div style="margin-top:12px;font-size:13px;line-height:1.8;"><div><strong>Area:</strong> ${Number(plot.areaSqFt || 0).toFixed(2)} Sq.Ft</div><div><strong>Customer:</strong> ${escapeHtml(plot.customerName || "—")}</div><div><strong>Phone:</strong> ${escapeHtml(plot.customerPhone || "—")}</div><div><strong>Employee:</strong> ${escapeHtml(plot.assignedEmployee || "—")}</div><div><strong>Follow-up:</strong> ${escapeHtml(plot.followUpDate || "—")}</div></div><button class="secondary-btn" onclick="openPlotDetails('${escapeAttr(plot.project)}','${escapeAttr(plot.phase)}',${plot.plotNumber})" style="width:100%;margin-top:12px;">${canEditPropertyPlot() ? "View / Update Plot" : "View Plot"}</button></div>`;
        }).join("") || `<div class="panel" style="padding:30px;grid-column:1/-1;text-align:center;">No plots match your search/filter.</div>`;
    };
    document.getElementById("dynamicPlotSearch").addEventListener("input", render);
    document.getElementById("dynamicPlotFilter").addEventListener("change", render);
    document.getElementById("dynamicPlotEmployeeFilter").addEventListener("change", render);
    render();
};

window.openAddPropertyPlotsModal = function(project, phase) {
    if (!canEditPropertyPlot()) return alert("You do not have permission to add plots.");
    document.getElementById("c1pxAddPlotsModal")?.remove();
    const existing = getDynamicPlotsForPhase(project, phase).map(p => Number(p.plot_number));
    const next = existing.length ? Math.max(...existing) + 1 : 1;
    const modal = document.createElement("div"); modal.id = "c1pxAddPlotsModal";
    modal.innerHTML = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;"><div style="width:100%;max-width:460px;background:#fff;border-radius:18px;padding:28px;"><h2 style="margin:0 0 6px;">Add Plots</h2><p class="muted" style="margin:0 0 20px;">${escapeHtml(project)} • ${escapeHtml(phase)}</p><label>Starting Plot Number</label><input id="c1pxPlotStart" type="number" min="1" value="${next}" style="width:100%;box-sizing:border-box;padding:12px;margin:7px 0 14px;border:1px solid #d1d5db;border-radius:10px;"><label>Number of Plots</label><input id="c1pxPlotCount" type="number" min="1" max="10000" value="1" style="width:100%;box-sizing:border-box;padding:12px;margin:7px 0 14px;border:1px solid #d1d5db;border-radius:10px;"><label>Default Area (Sq.Ft)</label><input id="c1pxPlotArea" type="number" min="0" step="0.01" value="0" style="width:100%;box-sizing:border-box;padding:12px;margin:7px 0 20px;border:1px solid #d1d5db;border-radius:10px;"><div style="display:flex;gap:10px;justify-content:flex-end;"><button class="secondary-btn" onclick="document.getElementById('c1pxAddPlotsModal')?.remove()">Cancel</button><button id="c1pxAddPlotsBtn" class="primary-btn" onclick="saveC1PXPlots('${escapeAttr(project)}','${escapeAttr(phase)}')">Add Plots</button></div><div id="c1pxAddPlotsMsg" style="margin-top:12px;color:#dc2626;font-size:14px;"></div></div></div>`;
    document.body.appendChild(modal);
};

window.saveC1PXPlots = async function(project, phase) {
    if (!canEditPropertyPlot()) return alert("You do not have permission to add plots.");
    const start = Number(document.getElementById("c1pxPlotStart").value);
    const count = Number(document.getElementById("c1pxPlotCount").value);
    const areaFt = Number(document.getElementById("c1pxPlotArea").value || 0);
    const msg = document.getElementById("c1pxAddPlotsMsg"); const btn = document.getElementById("c1pxAddPlotsBtn");
    if (!Number.isInteger(start) || start < 1 || !Number.isInteger(count) || count < 1 || count > 10000) return msg.textContent = "Enter valid plot numbers.";
    btn.disabled = true; btn.textContent = "Adding...";
    const rows = Array.from({length: count}, (_, i) => ({ company_id: currentCompany.id, project_name: project, phase_name: phase, plot_number: start + i, area_sq_m: areaFt / 10.7639, area_sq_ft: areaFt, status: "Available" }));
    const { error } = await db.from("property_plots").upsert(rows, { onConflict: "company_id,project_name,phase_name,plot_number", ignoreDuplicates: true });
    if (error) { msg.textContent = error.message; btn.disabled = false; btn.textContent = "Add Plots"; return; }
    await loadC1PXDynamicPlots();
    const phaseRow = propertyPhases.find(p => p.project_name === project && p.phase_name === phase);
    if (phaseRow) {
        const highest = Math.max(Number(phaseRow.total_plots || 0), start + count - 1);
        if (highest !== Number(phaseRow.total_plots)) {
            await db.from("property_phases").update({ total_plots: highest, updated_at: new Date().toISOString() }).eq("id", phaseRow.id).eq("company_id", currentCompany.id);
            phaseRow.total_plots = highest;
        }
    }
    document.getElementById("c1pxAddPlotsModal")?.remove();
    openPropertyPlots(project, phase, phaseRow?.id);
};

// Make plot lookup prefer the permanent database records.
function findPropertyPlot(project, phase, plotNumber) {
    const dbPlot = c1pxDynamicPlots.find(p => p.project_name === project && p.phase_name === phase && Number(p.plot_number) === Number(plotNumber));
    if (dbPlot) return dynamicPlotToUI(dbPlot);
    const legacy = getAllPropertyPlots().find(p => p.project === project && p.phase === phase && Number(p.plotNumber) === Number(plotNumber));
    return legacy || null;
}

// Override the existing save handler's persistence target through a wrapper helper.
async function saveDynamicPlotRecord(plot) {
    const row = {
        company_id: currentCompany.id,
        project_name: plot.project,
        phase_name: plot.phase,
        plot_number: Number(plot.plotNumber),
        area_sq_m: Number(plot.areaSqM || 0),
        area_sq_ft: Number(plot.areaSqFt || 0),
        status: plot.status || "Available",
        customer_name: plot.customerName || null,
        customer_phone: plot.customerPhone || null,
        assigned_employee: plot.assignedEmployee || null,
        visit_date: plot.visitDate || null,
        hold_until: plot.holdUntil || null,
        follow_up_date: plot.followUpDate || null,
        notes: plot.notes || null,
        updated_at: new Date().toISOString()
    };
    const { data, error } = await db.from("property_plots").upsert(row, { onConflict: "company_id,project_name,phase_name,plot_number" }).select().single();
    if (error) throw error;
    const idx = c1pxDynamicPlots.findIndex(p => p.project_name === plot.project && p.phase_name === plot.phase && Number(p.plot_number) === Number(plot.plotNumber));
    if (idx >= 0) c1pxDynamicPlots[idx] = data; else c1pxDynamicPlots.push(data);
    return data;
}

// Rebind the existing modal save button at runtime by wrapping openPlotDetails.
const c1pxOriginalOpenPlotDetails = window.openPlotDetails;
window.openPlotDetails = function(project, phase, plotNumber) {
    if (c1pxDynamicPlots.some(p => p.project_name === project && p.phase_name === phase && Number(p.plot_number) === Number(plotNumber))) {
        const plot = findPropertyPlot(project, phase, plotNumber);
        return openDynamicPlotEditor(plot);
    }
    return c1pxOriginalOpenPlotDetails(project, phase, plotNumber);
};

function openDynamicPlotEditor(plot) {
    const old = document.getElementById("plotDetailsModal"); if (old) old.remove();
    const modal = document.createElement("div"); modal.id = "plotDetailsModal";
    const employees = (companyEmployees || []).map(e => `<option value="${escapeAttr(e.name)}" ${e.name === plot.assignedEmployee ? "selected" : ""}>${escapeHtml(e.name)}</option>`).join("");
    modal.innerHTML = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;"><div style="width:100%;max-width:650px;max-height:90vh;overflow-y:auto;background:#fff;border-radius:20px;"><div style="padding:22px 24px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;"><div><div style="font-size:22px;font-weight:800;">Plot ${plot.plotNumber}</div><div style="font-size:13px;color:#6b7280;margin-top:4px;">${escapeHtml(plot.project)} • ${escapeHtml(plot.phase)}<div style="margin-top:8px;font-size:14px;font-weight:700;color:#111827;">${Number(plot.areaSqM||0).toFixed(2)} Sq.M • ${Number(plot.areaSqFt||0).toFixed(2)} Sq.Ft</div></div></div><button id="c1pxClosePlot" style="width:38px;height:38px;border:0;border-radius:50%;background:#f3f4f6;font-size:22px;">×</button></div><div style="padding:24px;"><label>Plot Status</label><select id="c1pxPlotStatus" style="width:100%;padding:12px;margin:7px 0 16px;border:1px solid #d1d5db;border-radius:10px;"><option>Available</option><option>On Hold</option><option>Sold</option><option>Pipeline</option><option>Site Visit</option></select><label>Customer Name</label><input id="c1pxPlotCustomer" value="${escapeAttr(plot.customerName)}" style="width:100%;box-sizing:border-box;padding:12px;margin:7px 0 16px;border:1px solid #d1d5db;border-radius:10px;"><label>Customer Mobile</label><input id="c1pxPlotPhone" value="${escapeAttr(plot.customerPhone)}" style="width:100%;box-sizing:border-box;padding:12px;margin:7px 0 16px;border:1px solid #d1d5db;border-radius:10px;"><label>Assigned Employee</label><select id="c1pxPlotEmployee" style="width:100%;padding:12px;margin:7px 0 16px;border:1px solid #d1d5db;border-radius:10px;"><option value="">Unassigned</option>${employees}</select><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div><label>Visit Date</label><input id="c1pxPlotVisit" type="date" value="${escapeAttr(plot.visitDate)}" style="width:100%;box-sizing:border-box;padding:12px;margin-top:7px;border:1px solid #d1d5db;border-radius:10px;"></div><div><label>Hold Until</label><input id="c1pxPlotHold" type="date" value="${escapeAttr(plot.holdUntil)}" style="width:100%;box-sizing:border-box;padding:12px;margin-top:7px;border:1px solid #d1d5db;border-radius:10px;"></div></div><div style="margin-top:16px;"><label>Follow-up Date</label><input id="c1pxPlotFollow" type="date" value="${escapeAttr(plot.followUpDate)}" style="width:100%;box-sizing:border-box;padding:12px;margin-top:7px;border:1px solid #d1d5db;border-radius:10px;"></div><div style="margin-top:16px;"><label>Notes</label><textarea id="c1pxPlotNotes" rows="4" style="width:100%;box-sizing:border-box;padding:12px;margin-top:7px;border:1px solid #d1d5db;border-radius:10px;">${escapeHtml(plot.notes)}</textarea></div><div style="display:flex;gap:10px;margin-top:22px;">${currentEmployee?.role === "Admin" ? `<button id="c1pxDeletePlot" class="secondary-btn" style="color:#dc2626;">Delete Plot</button>` : ""}<button id="c1pxCancelPlot" class="secondary-btn" style="flex:1;">Cancel</button><button id="c1pxSavePlot" class="primary-btn" style="flex:1;">Save Changes</button></div><div id="c1pxPlotMsg" style="margin-top:12px;color:#dc2626;"></div></div></div></div>`;
    document.body.appendChild(modal);
    document.getElementById("c1pxPlotStatus").value = plot.status || "Available";
    const close = () => modal.remove(); document.getElementById("c1pxClosePlot").onclick = close; document.getElementById("c1pxCancelPlot").onclick = close;
    const editable = canEditPropertyPlot();
    if (!editable) { modal.querySelectorAll("input,select,textarea").forEach(el => {el.disabled=true;}); document.getElementById("c1pxSavePlot").disabled=true; document.getElementById("c1pxSavePlot").textContent="View Only"; }
    document.getElementById("c1pxSavePlot").onclick = async () => {
        const btn = document.getElementById("c1pxSavePlot"); const msg = document.getElementById("c1pxPlotMsg"); btn.disabled=true; btn.textContent="Saving...";
        try {
            plot.status = document.getElementById("c1pxPlotStatus").value;
            plot.customerName = document.getElementById("c1pxPlotCustomer").value.trim();
            plot.customerPhone = document.getElementById("c1pxPlotPhone").value.trim();
            plot.assignedEmployee = document.getElementById("c1pxPlotEmployee").value;
            plot.visitDate = document.getElementById("c1pxPlotVisit").value;
            plot.holdUntil = document.getElementById("c1pxPlotHold").value;
            plot.followUpDate = document.getElementById("c1pxPlotFollow").value;
            plot.notes = document.getElementById("c1pxPlotNotes").value.trim();
            await saveDynamicPlotRecord(plot);
            close(); openPropertyPlots(plot.project, plot.phase, null);
        } catch (e) { msg.textContent = e.message || "Failed to save plot."; btn.disabled=false; btn.textContent="Save Changes"; }
    };
    const deleteButton = document.getElementById("c1pxDeletePlot");
    if (deleteButton) {
        deleteButton.onclick = async () => {
            if (currentEmployee?.role !== "Admin") return alert("Only Admin can delete plots.");
            if (!confirm(`Delete Plot ${plot.plotNumber}? This cannot be undone.`)) return;
            deleteButton.disabled = true; deleteButton.textContent = "Deleting...";
            const { error } = await db.from("property_plots").delete().eq("company_id", currentCompany.id).eq("project_name", plot.project).eq("phase_name", plot.phase).eq("plot_number", Number(plot.plotNumber));
            if (error) { deleteButton.disabled=false; deleteButton.textContent="Delete Plot"; return alert(error.message); }
            c1pxDynamicPlots = c1pxDynamicPlots.filter(p => !(p.project_name === plot.project && p.phase_name === plot.phase && Number(p.plot_number) === Number(plot.plotNumber)));
            modal.remove(); openPropertyPlots(plot.project, plot.phase, null);
        };
    }
}


// Safer phase deletion: remove its permanent plot records first.
window.deletePropertyPhase = async function(phaseId) {
    if (currentEmployee?.role !== "Admin") return alert("Only Admin can delete phases.");
    if (!currentCompany) await loadCompany();
    const phase = propertyPhases.find(p => String(p.id) === String(phaseId));
    if (!phase) return alert("Phase not found.");
    if (!confirm(`Delete phase "${phase.phase_name}" and all its plots? This cannot be undone.`)) return;
    try {
        const { error: plotError } = await db.from("property_plots").delete().eq("company_id", currentCompany.id).eq("project_name", phase.project_name).eq("phase_name", phase.phase_name);
        if (plotError) throw plotError;
        const { error: phaseError } = await db.from("property_phases").delete().eq("id", phase.id).eq("company_id", currentCompany.id);
        if (phaseError) throw phaseError;
        propertyPhases = propertyPhases.filter(p => String(p.id) !== String(phase.id));
        c1pxDynamicPlots = c1pxDynamicPlots.filter(p => !(p.project_name === phase.project_name && p.phase_name === phase.phase_name));
        await loadC1PXProjects();
        loadPage("properties");
    } catch (e) { alert(e.message || "Failed to delete phase."); }
};


// =====================================================
// C1PX - LEAD EXPORT
// =====================================================

function c1pxEscapeCSV(value) {
    const text = value == null ? "" : String(value);
    return `"${text.replace(/"/g, '""')}"`;
}

function c1pxLeadExportRows() {
    const source = Array.isArray(leads) ? leads : [];

    return source.map(lead => ({
        "Name": lead.name || lead.customer_name || "",
        "Mobile": lead.mobile || lead.phone || "",
        "WhatsApp": lead.whatsapp || "",
        "Email": lead.email || "",
        "Job Title": lead.job_title || "",
        "DOB": lead.dob || "",
        "Location": lead.location || "",
        "Budget": lead.budget || "",
        "Interested Project": lead.interested_project || lead.project || "",
        "Property Type": lead.property_type || lead.type || "",
        "Source": lead.source || "",
        "Campaign": lead.campaign_name || lead.campaign || "",
        "Ad Set": lead.ad_set_name || lead.ad_set || "",
        "Ad": lead.ad_name || lead.ad || "",
        "Form": lead.form_name || lead.form || "",
        "Meta Lead ID": lead.meta_lead_id || "",
        "Assigned Employee": lead.assigned_employee || lead.employee || "",
        "Status": lead.status || "",
        "Follow-up Date": lead.follow_up_date || lead.followup_date || "",
        "Follow-up Time": lead.follow_up_time || lead.followup_time || "",
        "Notes": lead.notes || "",
        "Created Date": lead.created_at || lead.created_date || ""
    }));
}

window.exportLeadsCSV = function () {
    const rows = c1pxLeadExportRows();

    if (!rows.length) {
        alert("No leads available to export.");
        return;
    }

    const headers = Object.keys(rows[0]);
    const csv = [
        headers.map(c1pxEscapeCSV).join(","),
        ...rows.map(row => headers.map(h => c1pxEscapeCSV(row[h])).join(","))
    ].join("\r\n");

    const blob = new Blob(["\ufeff" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `C1PX_Leads_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

window.exportLeadsXLSX = async function () {
    const rows = c1pxLeadExportRows();

    if (!rows.length) {
        alert("No leads available to export.");
        return;
    }

    if (!window.XLSX) {
        alert("Excel export library is not loaded. Please refresh the page and try again.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    XLSX.writeFile(
        workbook,
        `C1PX_Leads_${new Date().toISOString().slice(0,10)}.xlsx`
    );
};


function ensureC1PXLeadExportButtons() {
    if (document.getElementById("c1pxLeadExportButtons")) return;

    const candidates = Array.from(document.querySelectorAll("button"));
    const importButton = candidates.find(btn =>
        /import\s+leads/i.test(btn.textContent || "")
    );

    if (!importButton) return;

    const wrap = document.createElement("span");
    wrap.id = "c1pxLeadExportButtons";
    wrap.style.cssText = "display:inline-flex;gap:8px;margin-left:8px;";

    wrap.innerHTML = `
        <button type="button" class="secondary-btn" onclick="exportLeadsCSV()">
            Export CSV
        </button>
        <button type="button" class="secondary-btn" onclick="exportLeadsXLSX()">
            Export Excel
        </button>
    `;

    importButton.parentNode.insertBefore(wrap, importButton.nextSibling);
}



(function initC1PXLeadExportObserver() {
    const run = () => {
        if (typeof ensureC1PXLeadExportButtons === "function") {
            ensureC1PXLeadExportButtons();
        }
    };
    setTimeout(run, 300);
    if (document && document.body) {
        const observer = new MutationObserver(() => run());
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
