import { db } from "./db";
import { users, products, tasks, paymentChannels, platformSettings, countries, stakingProducts } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";

export async function seed() {
  console.log("Seeding database...");

  // Create session table for connect-pg-simple (if not exists)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
    ) WITH (OIDS=FALSE)
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")
  `);

  // Ensure countries table exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "countries" (
      "id" serial PRIMARY KEY,
      "code" text NOT NULL UNIQUE,
      "name" text NOT NULL,
      "currency" text NOT NULL,
      "phone_prefix" text NOT NULL,
      "operators" text NOT NULL DEFAULT '[]',
      "is_active" boolean NOT NULL DEFAULT true
    )
  `);

  // ── Admin 1 ──────────────────────────────────────────────────────────────
  const admin1Phone    = process.env.ADMIN_PHONE    || "99935673";
  const admin1Password = process.env.ADMIN_PASSWORD || "pagetstudio";
  const admin1Pin      = process.env.ADMIN_PIN      || "9993";
  const admin1Country  = process.env.ADMIN_COUNTRY  || "NE";

  const existingAdmin = await db.select().from(users).where(eq(users.phone, admin1Phone));

  if (existingAdmin.length === 0) {
    const hashedPassword = await bcrypt.hash(admin1Password, 12);
    await db.insert(users).values({
      fullName: "Super Admin",
      phone: admin1Phone,
      country: admin1Country,
      password: hashedPassword,
      referralCode: "ADMIN1",
      balance: "0",
      isAdmin: true,
      isSuperAdmin: true,
      adminPin: admin1Pin,
    });
    console.log("Super admin 1 created");
  } else {
    const hashedPassword = await bcrypt.hash(admin1Password, 12);
    await db.update(users)
      .set({
        country: admin1Country,
        password: hashedPassword,
        isAdmin: true,
        isSuperAdmin: true,
        adminPin: admin1Pin,
      })
      .where(eq(users.phone, admin1Phone));
    console.log("Super admin 1 updated");
  }

  // ── Admin 2 (optionnel — activé si ADMIN2_PHONE est défini) ──────────────
  const admin2Phone    = process.env.ADMIN2_PHONE;
  const admin2Password = process.env.ADMIN2_PASSWORD;
  const admin2Pin      = process.env.ADMIN2_PIN;
  const admin2Country  = process.env.ADMIN2_COUNTRY  || "NE";
  const admin2Name     = process.env.ADMIN2_NAME     || "Super Admin 2";

  if (admin2Phone && admin2Password && admin2Pin) {
    const existingAdmin2 = await db.select().from(users).where(eq(users.phone, admin2Phone));

    if (existingAdmin2.length === 0) {
      const hashedPassword2 = await bcrypt.hash(admin2Password, 12);
      await db.insert(users).values({
        fullName: admin2Name,
        phone: admin2Phone,
        country: admin2Country,
        password: hashedPassword2,
        referralCode: "ADMIN2",
        balance: "0",
        isAdmin: true,
        isSuperAdmin: true,
        adminPin: admin2Pin,
      });
      console.log("Super admin 2 created");
    } else {
      const hashedPassword2 = await bcrypt.hash(admin2Password, 12);
      await db.update(users)
        .set({
          fullName: admin2Name,
          country: admin2Country,
          password: hashedPassword2,
          isAdmin: true,
          isSuperAdmin: true,
          adminPin: admin2Pin,
        })
        .where(eq(users.phone, admin2Phone));
      console.log("Super admin 2 updated");
    }
  }

  // Seed/update countries (TD, NE, CF)
  const requiredCountries = [
    {
      code: "TD",
      name: "Tchad",
      currency: "XAF",
      phonePrefix: "235",
      operators: JSON.stringify(["Airtel Tchad", "Moov Africa Tchad"]),
      isActive: false,
    },
    {
      code: "NE",
      name: "Niger",
      currency: "XOF",
      phonePrefix: "227",
      operators: JSON.stringify(["NITA TRANSFERT", "AMANA TRANSFERT"]),
      isActive: true,
    },
    {
      code: "CF",
      name: "Centrafrique",
      currency: "XAF",
      phonePrefix: "236",
      operators: JSON.stringify(["Telecel Centrafrique", "Orange Centrafrique"]),
      isActive: false,
    },
  ];

  for (const countryData of requiredCountries) {
    const existing = await db.select().from(countries).where(eq(countries.code, countryData.code));
    if (existing.length === 0) {
      await db.insert(countries).values(countryData);
      console.log(`Country added: ${countryData.name}`);
    } else {
      // isActive intentionnellement exclu : l'admin gère l'activation/désactivation, le seed ne l'écrase pas
      await db.update(countries).set({
        name: countryData.name,
        currency: countryData.currency,
        phonePrefix: countryData.phonePrefix,
        operators: countryData.operators,
      }).where(eq(countries.code, countryData.code));
      console.log(`Country updated: ${countryData.name}`);
    }
  }

  // Check if products exist - update all products to match VIP structure
  const existingProducts = await db.select().from(products);
  const requiredProducts = [
    {
      name: "Bonus Gratuit",
      price: 0,
      dailyEarnings: 50,
      cycleDays: 1,
      totalReturn: 50,
      isFree: true,
      sortOrder: 0,
    },
    {
      name: "VIP 1",
      price: 5000,
      dailyEarnings: 400,
      cycleDays: 30,
      totalReturn: 12000,
      sortOrder: 1,
    },
    {
      name: "VIP 2",
      price: 10000,
      dailyEarnings: 900,
      cycleDays: 30,
      totalReturn: 27000,
      sortOrder: 2,
    },
    {
      name: "VIP 3",
      price: 20000,
      dailyEarnings: 1900,
      cycleDays: 30,
      totalReturn: 57000,
      sortOrder: 3,
    },
    {
      name: "VIP 4",
      price: 30000,
      dailyEarnings: 3000,
      cycleDays: 30,
      totalReturn: 90000,
      sortOrder: 4,
    },
    {
      name: "VIP 5",
      price: 50000,
      dailyEarnings: 5000,
      cycleDays: 30,
      totalReturn: 150000,
      sortOrder: 5,
    },
    {
      name: "VIP 6",
      price: 100000,
      dailyEarnings: 12000,
      cycleDays: 30,
      totalReturn: 360000,
      sortOrder: 6,
    },
    {
      name: "VIP 7",
      price: 200000,
      dailyEarnings: 25000,
      cycleDays: 30,
      totalReturn: 750000,
      sortOrder: 7,
    },
    {
      name: "VIP 8",
      price: 400000,
      dailyEarnings: 60000,
      cycleDays: 30,
      totalReturn: 1800000,
      sortOrder: 8,
    },
    {
      name: "VIP 9",
      price: 800000,
      dailyEarnings: 130000,
      cycleDays: 30,
      totalReturn: 3900000,
      sortOrder: 9,
    },
  ];

  const usedIds = new Set<number>();

  for (const productData of requiredProducts) {
    let existing = existingProducts.find(p => p.name === productData.name);
    if (!existing) {
      existing = existingProducts.find(p => p.price === productData.price && !usedIds.has(p.id));
    }
    if (existing) {
      usedIds.add(existing.id);
      await db.update(products).set({
        name: productData.name,
        price: productData.price,
        dailyEarnings: productData.dailyEarnings,
        cycleDays: productData.cycleDays,
        totalReturn: productData.totalReturn,
        sortOrder: productData.sortOrder,
        isFree: productData.isFree || false,
        isActive: true,
      }).where(eq(products.id, existing.id));
      console.log(`Product updated: ${productData.name}`);
    } else {
      await db.insert(products).values(productData);
      console.log(`Product added: ${productData.name}`);
    }
  }

  for (const existing of existingProducts) {
    if (!usedIds.has(existing.id)) {
      await db.update(products).set({ isActive: false, sortOrder: 99 }).where(eq(products.id, existing.id));
      console.log(`Product deactivated: ${existing.name}`);
    }
  }
  console.log("Products updated to VIP structure");

  // Check if tasks exist
  const existingTasks = await db.select().from(tasks);
  const requiredTasks = [
    { name: "Parrain Bronze", description: "Inviter 3 personnes a investir", requiredInvites: 3, reward: 350, sortOrder: 1 },
    { name: "Parrain Argent", description: "Inviter 5 personnes a investir", requiredInvites: 5, reward: 750, sortOrder: 2 },
    { name: "Parrain Or", description: "Inviter 10 personnes a investir", requiredInvites: 10, reward: 2500, sortOrder: 3 },
    { name: "Parrain Platine", description: "Inviter 30 personnes a investir", requiredInvites: 30, reward: 6500, sortOrder: 4 },
    { name: "Parrain Diamant", description: "Inviter 100 personnes a investir", requiredInvites: 100, reward: 15000, sortOrder: 5 },
    { name: "Parrain Elite", description: "Inviter 300 personnes a investir", requiredInvites: 300, reward: 50000, sortOrder: 6 },
  ];

  for (const taskData of requiredTasks) {
    const existing = existingTasks.find(t => t.name === taskData.name);
    if (!existing) {
      await db.insert(tasks).values(taskData);
      console.log(`Task added: ${taskData.name}`);
    } else {
      if (existing.reward !== taskData.reward || existing.requiredInvites !== taskData.requiredInvites || existing.description !== taskData.description) {
        await db.update(tasks).set({
          reward: taskData.reward,
          requiredInvites: taskData.requiredInvites,
          description: taskData.description,
          sortOrder: taskData.sortOrder,
        }).where(eq(tasks.id, existing.id));
        console.log(`Task updated: ${taskData.name}`);
      }
    }
  }
  console.log("Tasks check complete (existing values preserved)");

  // Check if payment channels exist
  const existingChannels = await db.select().from(paymentChannels);
  if (existingChannels.length === 0) {
    await db.insert(paymentChannels).values([
      { name: "LeekPay", redirectUrl: "https://leekpay.com/pay", isApi: false },
      { name: "FedaPay", redirectUrl: "https://fedapay.com/payment", isApi: false },
    ]);
    console.log("Payment channels seeded");
  }

  // Check if settings exist - apply new values for new keys or update existing
  const existingSettings = await db.select().from(platformSettings);
  const requiredSettings = [
    { key: "supportLink", value: "https://t.me/intelappgroup" },
    { key: "supportType", value: "telegram" },
    { key: "supportLabel", value: "Service client" },
    { key: "support2Link", value: "https://t.me/intelappgroup" },
    { key: "support2Type", value: "telegram" },
    { key: "support2Label", value: "Service client 2" },
    { key: "channelLink", value: "https://t.me/intelappgroup" },
    { key: "channelType", value: "telegram" },
    { key: "channelLabel", value: "Chaîne officielle" },
    { key: "groupLink", value: "https://t.me/intelappgroup" },
    { key: "groupType", value: "telegram" },
    { key: "groupLabel", value: "Groupe de discussion" },
    { key: "popupButtonLabel", value: "Cliquez ici pour rejoindre le groupe Telegram" },
    { key: "supportEnabled", value: "true" },
    { key: "support2Enabled", value: "true" },
    { key: "channelEnabled", value: "true" },
    { key: "groupEnabled", value: "true" },
    { key: "minDeposit", value: "5000" },
    { key: "minWithdrawal", value: "2000" },
    { key: "withdrawalFees", value: "20" },
    { key: "withdrawalStartHour", value: "9" },
    { key: "withdrawalEndHour", value: "17" },
    { key: "maxWithdrawalsPerDay", value: "1" },
    { key: "level1Commission", value: "15" },
    { key: "level2Commission", value: "2" },
    { key: "level3Commission", value: "1" },
    { key: "signupBonus", value: "200" },
    { key: "soleaspayEnabled", value: "false" },
    { key: "soleaspayCountries", value: "" },
    { key: "soleaspayChannelName", value: "Westpay" },
    { key: "omnipayEnabled", value: "false" },
    { key: "omnipayChannelName", value: "OmniPay" },
    { key: "omnipayCallbackKey", value: "" },
    { key: "withdrawalDays", value: "1,2,3,4,5,6" },
    { key: "blockedEarningsDates", value: "" },
  ];

  for (const settingData of requiredSettings) {
    const existing = existingSettings.find(s => s.key === settingData.key);
    if (!existing) {
      await db.insert(platformSettings).values(settingData);
      console.log(`Setting added: ${settingData.key} = ${settingData.value}`);
    } else {
      // Force update critical business settings to new values
      const forceUpdate = ["minDeposit", "minWithdrawal", "withdrawalFees", "withdrawalStartHour", "maxWithdrawalsPerDay", "level1Commission", "level2Commission", "level3Commission", "signupBonus"];
      if (forceUpdate.includes(settingData.key)) {
        await db.update(platformSettings).set({ value: settingData.value }).where(eq(platformSettings.key, settingData.key));
        console.log(`Setting force-updated: ${settingData.key} = ${settingData.value}`);
      } else {
        console.log(`Setting preserved: ${settingData.key} = ${existing.value}`);
      }
    }
  }
  console.log("Settings check complete");

  // Staking products — upsert by name
  const requiredStakingProducts = [
    { name: "Produit 1", description: "5% par jour pendant 3 jours. Capital récupérable à la fin.", price: 2000, returnAmount: 2300, lockDays: 3 },
    { name: "Produit 2", description: "5% par jour pendant 7 jours. Capital récupérable à la fin.", price: 5000, returnAmount: 6750, lockDays: 7 },
    { name: "Produit 3", description: "5% par jour pendant 12 jours. Capital récupérable à la fin.", price: 10000, returnAmount: 16000, lockDays: 12 },
    { name: "Produit 4", description: "5% par jour pendant 16 jours. Capital récupérable à la fin.", price: 20000, returnAmount: 36000, lockDays: 16 },
    { name: "Produit 5", description: "5% par jour pendant 20 jours. Capital récupérable à la fin.", price: 50000, returnAmount: 100000, lockDays: 20 },
  ];

  const existingStakingProducts = await db.select().from(stakingProducts);
  for (const sp of requiredStakingProducts) {
    const existing = existingStakingProducts.find(e => e.name === sp.name);
    if (existing) {
      await db.update(stakingProducts).set({ price: sp.price, returnAmount: sp.returnAmount, lockDays: sp.lockDays, description: sp.description, isActive: true }).where(eq(stakingProducts.id, existing.id));
    } else {
      await db.insert(stakingProducts).values({ ...sp, isActive: true });
    }
  }
  console.log("Staking products check complete");

  console.log("Database seeding complete!");
}
