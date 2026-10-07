import { test, expect } from "@playwright/test";
const base = "/VitaPath";
test("homepage and gallery work at the GitHub Pages base path", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/`);
  await expect(
    page.getByRole("heading", {
      name: "A better document. A bigger possibility.",
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Explore templates", exact: true })
    .click();
  await expect(page.locator(".template-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Gulf / GCC", exact: true }).click();
  await expect(page.locator(".template-card")).toHaveCount(1);
  await page.getByRole("link", { name: "Use template", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Personal details", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("browser draft survives reload and supports repeatable entries and backups", async ({
  page,
}) => {
  await page.goto(`${base}/builder/?template=scholar`);
  await page.getByLabel("Full name", { exact: true }).fill("Test Applicant");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("test@example.com");
  await page.getByLabel("Document title").fill("Scholarship application");
  await page.getByRole("button", { name: "03 Education" }).click();
  await page
    .getByRole("button", { name: "Add education", exact: true })
    .click();
  await page
    .getByLabel("Qualification / programme")
    .fill("BSc Computer Science");
  await page.getByLabel("School / university").fill("Example University");
  await page
    .getByLabel("Highlights")
    .fill("Research project in accessible web design.");
  await page.reload();
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue(
    "Test Applicant",
  );
  await expect(page.locator(".cv-sheet")).toContainText("BSc Computer Science");
  await page.getByRole("button", { name: "06 Review & export" }).click();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export editable backup (.json)" })
    .click();
  expect((await download).suggestedFilename()).toBe(
    "Scholarship application.json",
  );
  await page.getByRole("link", { name: "My documents", exact: true }).click();
  await expect(page.locator(".document-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Duplicate", exact: true }).click();
  await expect(page.locator(".document-card")).toHaveCount(2);
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Delete", exact: true })
    .first()
    .click();
  await expect(page.locator(".document-card")).toHaveCount(1);
});
test("all letter templates open in a letter editor", async ({ page }) => {
  for (const template of [
    "cover",
    "motivation",
    "recommendation",
    "statement",
  ]) {
    await page.goto(`${base}/builder/?template=${template}`);
    await page.getByRole("button", { name: "02 Your letter" }).click();
    await expect(page.getByLabel("Main paragraphs")).toBeVisible();
    await page
      .getByLabel("Main paragraphs")
      .fill("My authentic application content.");
    await expect(page.locator(".cv-sheet")).toContainText(
      "My authentic application content.",
    );
  }
});
test("invalid import is rejected and a supported backup creates a new draft", async ({
  page,
}) => {
  await page.goto(`${base}/dashboard/`);
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"hello":1}'),
    });
  await expect(page.locator(".notice.error")).toContainText(
    "Choose a JSON backup",
  );
  const file = {
    format: "vitapath",
    version: 1,
    document: {
      id: "external-id",
      title: "Imported application",
      document_type: "resume",
      content: { name: "Imported User", template: "essential" },
    },
  };
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(file)),
    });
  await expect(page.locator(".document-card")).toContainText(
    "Imported application",
  );
});
test("registration, password reset, and readable auth errors", async ({
  page,
}) => {
  await page.route("**/auth/v1/token?grant_type=password", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error: "invalid_grant",
        error_description: "Invalid login credentials",
      }),
    }),
  );
  await page.goto(`${base}/login/`);
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator(".notice.error")).toContainText(
    "Invalid login credentials",
  );
  await page
    .getByRole("button", { name: "Create an account", exact: true })
    .click();
  await page.getByLabel("Full name").fill("Test Person");
  await page.getByLabel("Password", { exact: true }).fill("long-password");
  await page.getByLabel("Confirm password").fill("other-password");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page.locator(".notice.error")).toContainText("do not match");
  await page.getByRole("button", { name: "Back to sign in" }).click();
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("button", { name: "Send reset link" }),
  ).toBeVisible();
});
test("mobile navigation, editor, and preview do not overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/templates/",
    "/guides/",
    "/dashboard/",
    "/login/",
    "/builder/",
  ]) {
    await page.goto(`${base}${route}`);
    await page.waitForTimeout(150);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      route,
    ).toBeTruthy();
  }
  await page.getByLabel("Full name", { exact: true }).fill("Mobile Applicant");
  await page
    .getByRole("button", { name: "Preview document", exact: true })
    .click();
  await expect(page.locator(".preview-panel")).toBeVisible();
  await expect(page.locator(".preview-panel")).toContainText(
    "Mobile Applicant",
  );
  await page.goto(`${base}/`);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Writing guides" })
    .click();
  await expect(
    page.getByRole("heading", { name: "A little guidance. A clearer story." }),
  ).toBeVisible();
});
test("printing retains long document content and excludes editing controls", async ({
  page,
}) => {
  await page.goto(`${base}/builder/?template=modern`);
  await page
    .getByLabel("Full name", { exact: true })
    .fill("Print Test Applicant");
  await page
    .getByLabel("Professional summary")
    .fill("A summary for a document that spans multiple pages.");
  await page.getByRole("button", { name: "02 Experience" }).click();
  await page
    .getByRole("button", { name: "Add experience", exact: true })
    .click();
  await page.getByLabel("Role / project title").fill("Long document test");
  await page
    .getByLabel("Highlights")
    .fill(
      Array.from(
        { length: 65 },
        (_, i) =>
          `Verified achievement ${i + 1}: coordinated accessible documentation and tracked progress with the project team.`,
      ).join("\n"),
    );
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".workspace-header")).not.toBeVisible();
  await expect(page.locator(".cv-sheet")).toContainText(
    "Verified achievement 65",
  );
  await page.pdf({
    path: "qa/long-document.pdf",
    preferCSSPageSize: true,
    printBackground: true,
  });
});
test("account workflow saves, reopens, and updates a document through the data API", async ({
  page,
}) => {
  const id = "aa1d34b0-c0bc-442b-aa80-b9a5e9a23d11";
  const user = {
    id,
    email: "fixture@example.invalid",
    aud: "authenticated",
    role: "authenticated",
    app_metadata: { provider: "email" },
    user_metadata: {},
    created_at: "2026-01-01T00:00:00Z",
  };
  const encode = (v: unknown) =>
    Buffer.from(JSON.stringify(v)).toString("base64url");
  const token = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: id, aud: "authenticated", role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })}.fixture`;
  await page.addInitScript(
    (session) => localStorage.setItem("vitapath.auth", JSON.stringify(session)),
    {
      access_token: token,
      refresh_token: "fixture-refresh",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      expires_in: 3600,
      token_type: "bearer",
      user,
    },
  );
  let stored: Record<string, unknown> | null = null;
  let saves = 0;
  await page.route("**/auth/v1/user", (r) =>
    r.fulfill({ contentType: "application/json", body: JSON.stringify(user) }),
  );
  await page.route("**/rest/v1/profiles*", (r) =>
    r.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        id,
        full_name: "Test User",
        headline: "Applicant",
      }),
    }),
  );
  await page.route("**/rest/v1/documents*", async (r) => {
    const method = r.request().method();
    if (method === "POST" || method === "PATCH") {
      const body = r.request().postDataJSON();
      const value = Array.isArray(body) ? body[0] : body;
      stored = {
        ...stored,
        ...value,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: `2026-10-07T14:00:0${++saves}.000000+00:00`,
      };
      await r.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ updated_at: stored!.updated_at }),
      });
      return;
    }
    const single = r.request().headers().accept?.includes("vnd.pgrst.object");
    await r.fulfill({
      contentType: "application/json",
      body: JSON.stringify(single ? stored : stored ? [stored] : []),
    });
  });
  await page.goto(`${base}/builder/?template=modern`);
  await page.getByLabel("Full name", { exact: true }).fill("Account Applicant");
  await page.getByLabel("Document title").fill("Account resume");
  await page
    .getByRole("button", { name: "Save to account", exact: true })
    .click();
  await expect(page.locator(".document-name")).toContainText(
    "Saved to your account",
  );
  await page.getByRole("link", { name: "My documents", exact: true }).click();
  await expect(page.locator(".document-card")).toContainText("Account resume");
  await page.getByRole("link", { name: "Open document" }).click();
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue(
    "Account Applicant",
  );
  await page.getByLabel("Full name", { exact: true }).fill("Updated Applicant");
  await expect(page.locator(".document-name")).toContainText(
    "Unsaved account changes",
  );
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.locator(".document-name")).toContainText(
    "Saved to your account",
  );
  expect(saves).toBe(2);
});
