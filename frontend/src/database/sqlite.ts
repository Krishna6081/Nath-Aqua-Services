import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initSQLiteDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('nath_water_local.db');

    // Create offline cached products table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cached_products (
        id TEXT PRIMARY KEY,
        name TEXT,
        capacity TEXT,
        price REAL,
        unit TEXT,
        isAvailable INTEGER
      );
    `);

    // Create offline cached orders table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cached_orders (
        id TEXT PRIMARY KEY,
        orderNumber TEXT,
        totalAmount REAL,
        orderStatus TEXT,
        deliveryDate TEXT
      );
    `);

    console.log('✅ SQLite Offline Database initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize SQLite Database:', error);
  }
};

export const cacheProductsLocal = async (products: any[]) => {
  if (!db) return;
  try {
    for (const p of products) {
      await db.runAsync(
        `INSERT OR REPLACE INTO cached_products (id, name, capacity, price, unit, isAvailable) VALUES (?, ?, ?, ?, ?, ?);`,
        [p.id, p.name, p.capacity, p.price, p.unit, p.isAvailable ? 1 : 0]
      );
    }
  } catch (err) {
    console.error('Error caching products to SQLite:', err);
  }
};

export const getCachedProductsLocal = async () => {
  if (!db) return [];
  try {
    const allRows = await db.getAllAsync('SELECT * FROM cached_products;');
    return allRows;
  } catch (err) {
    console.error('Error reading cached products from SQLite:', err);
    return [];
  }
};
