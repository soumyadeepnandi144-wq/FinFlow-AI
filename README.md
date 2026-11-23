# FinFlow AI — Autonomous Finance Operations

**Hackathon theme:** B1 — Replace a Department, Not a Task  
**First submission:** 6 December 2026  
**Current stage: Project architecture and repository initialization.**

## Problem and proposed solution

Accounts payable staff copy invoice details between email, spreadsheets and purchasing software. When an invoice differs from a delivery record, reviewers must reconstruct the handoff before they can decide what to do. FinFlow AI proposes a single invoice history from PDF intake through verification, exception review and payment preparation.

## Planned features and workflow

Receive a PDF → extract candidate fields with Gemini → verify the vendor → match invoice, purchase order and goods receipt → check duplicates and anomalies → apply business rules → route exceptions for human review → prepare eligible records → generate audit reports. Payment release stays with finance.

## Proposed technology stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, custom CSS3, JavaScript and server-rendered EJS |
| Web server | Node.js and Express.js |
| Persistence | MongoDB with Mongoose |
| Document intake and AI | Multer and Google Gemini API |
| Architecture and version control | MVC with separate AI and automation services, Git and GitHub |

## System architecture

The browser submits a form to an Express route. Its controller delegates extraction or validation to services, which will use Mongoose models to access MongoDB. The controller returns an EJS view. See [ARCHITECTURE.md](ARCHITECTURE.md) for the decision flow and folder guide.

## Implementation status

Phase 1 contains commented placeholders, documentation and Git configuration. There are no runtime dependencies, server startup command or executable tests. Open this directory in an editor to inspect it. All processing, persistence, identity, UI, reporting and deployment work is planned.

## Development roadmap

| Phase | Deliverable | Completion check |
|---|---|---|
| 1 | Repository and architecture setup | Inspect both layouts, the initial commit and concept walkthrough. |
| 2 | Express and MongoDB integration | A local server can connect to a development database and report connection failure. |
| 3 | Invoice and vendor CRUD | Users can create, read, update and delete development records with field validation. |
| 4 | PDF upload and Gemini integration | Validate a test PDF and produce structured candidate fields, flagging unreadable input. |
| 5 | Purchase order matching and duplicate detection | Exercise exact matches, mismatches and repeated submissions. |
| 6 | Human approval and exception handling | A reviewer can trace a hold, record a reason and request corrections. |
| 7 | EJS dashboard, reports and audit logging | Trace an invoice from intake through its recorded decisions. |
| 8 | Testing, security and deployment | Exercise failure cases, verify access boundaries and deploy a reviewed build. |

## Team

| Role | Member |
|---|---|
| Repository and backend | [Name] |
| AI and automation | [Name] |
| Frontend and submission video | [Name] |

## Concept video

The first submission presents the workflow proposal and the actual scaffold. The script, storyboard and recording instructions are in [VIDEO_GUIDE.md](VIDEO_GUIDE.md). Add the final hosted video link here when available.

## December 6 checklist

- [x] Prepare the organized scaffold, architecture, roadmap and local Git history.
- [x] Prepare the separate flat reference and recording guide.
- [ ] Fill team names and review the final narration.
- [ ] Approve repository visibility, publish Version A and verify judge access.
- [ ] Upload the reviewed video, add its link here and push the README update.
- [ ] Test both links as a judge, submit them and retain the submission confirmation.

## GitHub setup

From the directory containing the extracted project, run:

```sh
cd department-automation
git status
git log -1 --oneline
```

After the team approves publication, sign in to GitHub and create an empty repository named `finflow-ai` under the intended account. Choose the visibility required by the event. Leave README, license and ignore-file initialization unchecked. Copy its HTTPS URL. In the commands below replace `YOUR-GITHUB-OWNER` with the actual account or organization.

```sh
git remote add origin https://github.com/YOUR-GITHUB-OWNER/finflow-ai.git
git remote -v
git push -u origin main
```

Open the actual repository after the push and verify the initial commit and reviewer access.

## Complete project tree

```text
department-automation/
├── config/
│   └── db.js
├── controllers/
│   ├── approvalController.js
│   ├── dashboardController.js
│   ├── invoiceController.js
│   ├── purchaseOrderController.js
│   ├── reportController.js
│   └── vendorController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── Approval.js
│   ├── AuditLog.js
│   ├── GoodsReceipt.js
│   ├── Invoice.js
│   ├── PurchaseOrder.js
│   ├── User.js
│   └── Vendor.js
├── public/
│   ├── css/
│   │   ├── dashboard.css
│   │   ├── invoice.css
│   │   └── style.css
│   ├── images/
│   │   └── .gitkeep
│   └── js/
│       ├── approval.js
│       ├── dashboard.js
│       ├── invoice.js
│       └── main.js
├── routes/
│   ├── approvalRoutes.js
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── invoiceRoutes.js
│   ├── purchaseOrderRoutes.js
│   ├── reportRoutes.js
│   └── vendorRoutes.js
├── services/
│   ├── ai/
│   │   ├── anomalyDetection.js
│   │   ├── geminiService.js
│   │   └── invoiceExtraction.js
│   ├── automation/
│   │   ├── approvalEngine.js
│   │   ├── duplicateDetection.js
│   │   ├── purchaseOrderMatching.js
│   │   ├── threeWayMatching.js
│   │   ├── vendorVerification.js
│   │   └── workflowEngine.js
│   └── pdfService.js
├── tests/
│   ├── approval.test.js
│   ├── automation.test.js
│   └── invoice.test.js
├── uploads/
│   └── .gitkeep
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
├── views/
│   ├── approvals/
│   │   ├── details.ejs
│   │   └── index.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── dashboard/
│   │   └── index.ejs
│   ├── invoices/
│   │   ├── details.ejs
│   │   ├── index.ejs
│   │   ├── processing.ejs
│   │   └── upload.ejs
│   ├── partials/
│   │   ├── footer.ejs
│   │   ├── header.ejs
│   │   ├── navbar.ejs
│   │   └── sidebar.ejs
│   ├── purchase-orders/
│   │   ├── details.ejs
│   │   └── index.ejs
│   ├── reports/
│   │   └── index.ejs
│   └── vendors/
│       ├── details.ejs
│       ├── edit.ejs
│       ├── index.ejs
│       └── new.ejs
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
├── README.md
├── VIDEO_GUIDE.md
├── package.json
└── server.js
```
