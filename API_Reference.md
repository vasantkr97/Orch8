# Orch8 API Reference

Use this document to manually test the API endpoints using Postman or any other API client.
**Base URL**: `http://localhost:3000`

---

## 🔐 Auth

### 1. Signup
Create a new user account.
- **URL**: `http://localhost:3000/api/auth/signup`
- **Method**: `POST`
- **Body** (JSON):
```json
{
  "username": "your_username",
  "email": "test@example.com",
  "password": "your_password"
}
```

### 2. Signin
Log in to an existing account. This will set a `jwt` cookie.
- **URL**: `http://localhost:3000/api/auth/signin`
- **Method**: `POST`
- **Body** (JSON):
```json
{
  "email": "test@example.com",
  "password": "your_password"
}
```

### 3. Signout
Log out and clear the session cookie.
- **URL**: `http://localhost:3000/api/auth/signout`
- **Method**: `POST`
- **Body**: None

### 4. Get Current User (Me)
Check authenticated user status.
- **URL**: `http://localhost:3000/api/auth/me`
- **Method**: `GET`
- **Body**: None

---

## ⚡ Workflows

### 5. Create Workflow
- **URL**: `http://localhost:3000/api/workflows/createWorkflow`
- **Method**: `POST`
- **Body** (JSON):
```json
{
  "title": "My New Workflow",
  "isActive": true,
  "triggerType": "MANUAL",
  "nodes": [],
  "connections": []
}
```
*Note: `triggerType` can be "MANUAL" or "WEBHOOK".*

### 6. Get All Workflows
- **URL**: `http://localhost:3000/api/workflows/getallWorkflows`
- **Method**: `GET`
- **Body**: None

### 7. Get Workflow By ID
- **URL**: `http://localhost:3000/api/workflows/getWorkflowById/REPLACE_WITH_WORKFLOW_ID`
- **Method**: `GET`
- **Body**: None

### 8. Update Workflow
- **URL**: `http://localhost:3000/api/workflows/updateWorkflow/REPLACE_WITH_WORKFLOW_ID`
- **Method**: `POST`
- **Body** (JSON):
```json
{
  "title": "Updated Title",
  "isActive": true,
  "triggerType": "MANUAL",
  "nodes": [],
  "connections": []
}
```

### 9. Delete Workflow
- **URL**: `http://localhost:3000/api/workflows/deleteWorkflow/REPLACE_WITH_WORKFLOW_ID`
- **Method**: `DELETE`
- **Body**: None

---

## 🔑 Credentials

### 10. Create Credentials
Store API keys or configuration for integrations.
- **URL**: `http://localhost:3000/api/credentials/postCredentials`
- **Method**: `POST`
- **Body** (JSON):
```json
{
  "title": "My Telegram Bot",
  "platform": "Telegram",
  "data": {
    "botToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
  }
}
```
*Note: `platform` values: "Telegram", "Gemini", "ResendEmail"*

### 11. Get All Credentials
- **URL**: `http://localhost:3000/api/credentials/getCredentials`
- **Method**: `POST`
- **Body**: None

### 12. Get Credential By ID
- **URL**: `http://localhost:3000/api/credentials/getCredentialById/REPLACE_WITH_CREDENTIAL_ID`
- **Method**: `GET`
- **Body**: None

### 13. Update Credentials
- **URL**: `http://localhost:3000/api/credentials/updateCredentials/REPLACE_WITH_CREDENTIAL_ID`
- **Method**: `PUT`
- **Body** (JSON):
```json
{
  "title": "Updated Bot Title",
  "platform": "Telegram",
  "data": {
    "botToken": "new_token_value"
  }
}
```

### 14. Delete Credentials
- **URL**: `http://localhost:3000/api/credentials/deleteCredentials/REPLACE_WITH_CREDENTIAL_ID`
- **Method**: `DELETE`
- **Body**: None

---

## 🚀 Executions

### 15. Manual Execute Workflow
Trigger a workflow manually.
- **URL**: `http://localhost:3000/api/executions/workflow/REPLACE_WITH_WORKFLOW_ID/execute`
- **Method**: `POST`
- **Body**: None

### 16. Webhook Execute (Public)
Trigger a workflow via a webhook. Use the token found in the workflow object.
- **URL**: `http://localhost:3000/api/executions/webhookExecute/REPLACE_WITH_WORKFLOW_ID?token=YOUR_WEBHOOK_TOKEN`
- **Method**: `POST`
- **Headers**:
  - `X-Webhook-Token`: `YOUR_WEBHOOK_TOKEN` (Optional if passed in query params)
- **Body**: (Optional payload to use in the workflow)
```json
{
  "some_data": "value"
}
```

### 17. List All Executions
Description: Get a list of past executions with optional filters.
- **URL**: `http://localhost:3000/api/executions/list?status=completed&mode=manual`
- **Method**: `GET`
- **Query Params**:
  - `status`: `pending` | `running` | `completed` | `failed` | `stopped`
  - `mode`: `manual` | `webhook`
  - `workflowId`: `REPLACE_WITH_WORKFLOW_ID`
- **Body**: None

### 18. Workflow Execution History
Get history for a specific workflow.
- **URL**: `http://localhost:3000/api/executions/workflow/REPLACE_WITH_WORKFLOW_ID/history`
- **Method**: `GET`
- **Body**: None

### 19. Get Execution Details
- **URL**: `http://localhost:3000/api/executions/REPLACE_WITH_EXECUTION_ID/details`
- **Method**: `GET`
- **Body**: None

### 20. Get Execution Status
- **URL**: `http://localhost:3000/api/executions/REPLACE_WITH_EXECUTION_ID/status`
- **Method**: `GET`
- **Body**: None

### 21. Stop Execution
Stop a running or pending execution.
- **URL**: `http://localhost:3000/api/executions/REPLACE_WITH_EXECUTION_ID/stop`
- **Method**: `POST`
- **Body**: None

### 22. Delete Execution
- **URL**: `http://localhost:3000/api/executions/REPLACE_WITH_EXECUTION_ID`
- **Method**: `DELETE`
- **Body**: None
