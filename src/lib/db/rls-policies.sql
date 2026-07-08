-- ============================================================================
-- Row Level Security (RLS) Policies
-- Run after schema migrations: npm run db:enable-rls
-- ============================================================================
--> statement-breakpoint

CREATE SCHEMA IF NOT EXISTS app;
--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- 1. Helper functions used by all policies
-- ---------------------------------------------------------------------------
--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.current_user_id() RETURNS uuid
  LANGUAGE SQL STABLE
  AS $$ SELECT current_setting('app.current_user_id', true)::uuid; $$;

--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.current_user_role() RETURNS text
  LANGUAGE SQL STABLE
  AS $$ SELECT current_setting('app.current_user_role', true); $$;

--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.is_admin() RETURNS boolean
  LANGUAGE SQL STABLE
  AS $$ SELECT current_setting('app.current_user_role', true) IN ('admin', 'super_admin'); $$;

--> statement-breakpoint

CREATE OR REPLACE FUNCTION app.is_owner_or_admin(owner_col uuid) RETURNS boolean
  LANGUAGE SQL STABLE
  AS $$ SELECT owner_col = app.current_user_id() OR app.is_admin(); $$;

--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- 2. Enable RLS on all user-owned tables
-- ---------------------------------------------------------------------------

ALTER TABLE addresses        ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE audit_logs       ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE blogs            ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE cart             ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE cart_items       ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE order_items      ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE reviews          ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE seller_profiles  ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE user_roles       ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE wishlists        ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE withdrawals      ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- 3. RLS Policies
-- ---------------------------------------------------------------------------

-- ========================================
-- addresses: user_id column
-- ========================================
CREATE POLICY addresses_select ON addresses FOR SELECT
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY addresses_insert ON addresses FOR INSERT
  WITH CHECK (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY addresses_update ON addresses FOR UPDATE
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY addresses_delete ON addresses FOR DELETE
  USING (app.is_owner_or_admin(user_id));

--> statement-breakpoint

-- ========================================
-- audit_logs: user_id column (nullable)
-- ========================================
CREATE POLICY audit_logs_select ON audit_logs FOR SELECT
  USING (app.is_owner_or_admin(user_id) OR user_id IS NULL);
--> statement-breakpoint
CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT
  WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY audit_logs_delete ON audit_logs FOR DELETE
  USING (app.is_admin());

--> statement-breakpoint

-- ========================================
-- blogs: author_id column
-- ========================================
CREATE POLICY blogs_select ON blogs FOR SELECT
  USING (published = true OR app.is_owner_or_admin(author_id));
--> statement-breakpoint
CREATE POLICY blogs_insert ON blogs FOR INSERT
  WITH CHECK (app.is_owner_or_admin(author_id));
--> statement-breakpoint
CREATE POLICY blogs_update ON blogs FOR UPDATE
  USING (app.is_owner_or_admin(author_id));
--> statement-breakpoint
CREATE POLICY blogs_delete ON blogs FOR DELETE
  USING (app.is_owner_or_admin(author_id));

--> statement-breakpoint

-- ========================================
-- cart: user_id column (unique per user)
-- ========================================
CREATE POLICY cart_select ON cart FOR SELECT
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY cart_insert ON cart FOR INSERT
  WITH CHECK (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY cart_update ON cart FOR UPDATE
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY cart_delete ON cart FOR DELETE
  USING (app.is_owner_or_admin(user_id));

--> statement-breakpoint

-- ========================================
-- cart_items: owned through cart.user_id
-- ========================================
CREATE POLICY cart_items_select ON cart_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND app.is_owner_or_admin(cart.user_id)));
--> statement-breakpoint
CREATE POLICY cart_items_insert ON cart_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND app.is_owner_or_admin(cart.user_id)));
--> statement-breakpoint
CREATE POLICY cart_items_update ON cart_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND app.is_owner_or_admin(cart.user_id)));
--> statement-breakpoint
CREATE POLICY cart_items_delete ON cart_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND app.is_owner_or_admin(cart.user_id)));

--> statement-breakpoint

-- ========================================
-- notifications: user_id column
-- ========================================
CREATE POLICY notifications_select ON notifications FOR SELECT
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY notifications_insert ON notifications FOR INSERT
  WITH CHECK (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY notifications_update ON notifications FOR UPDATE
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY notifications_delete ON notifications FOR DELETE
  USING (app.is_owner_or_admin(user_id));

--> statement-breakpoint

-- ========================================
-- orders: user_id column
-- ========================================
CREATE POLICY orders_select ON orders FOR SELECT
  USING (app.is_owner_or_admin(user_id) OR EXISTS (
    SELECT 1 FROM order_items oi JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = orders.id AND p.seller_id = app.current_user_id()
  ));
--> statement-breakpoint
CREATE POLICY orders_insert ON orders FOR INSERT
  WITH CHECK (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY orders_update ON orders FOR UPDATE
  USING (app.is_owner_or_admin(user_id) OR app.is_admin());
--> statement-breakpoint
CREATE POLICY orders_delete ON orders FOR DELETE
  USING (app.is_admin());

--> statement-breakpoint

-- ========================================
-- order_items: owned through orders.user_id
-- ========================================
CREATE POLICY order_items_select ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (
    app.is_owner_or_admin(orders.user_id)
    OR EXISTS (SELECT 1 FROM products WHERE products.id = order_items.product_id AND products.seller_id = app.current_user_id())
  )));
--> statement-breakpoint
CREATE POLICY order_items_insert ON order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND app.is_owner_or_admin(orders.user_id)));
--> statement-breakpoint
CREATE POLICY order_items_update ON order_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND app.is_owner_or_admin(orders.user_id)));
--> statement-breakpoint
CREATE POLICY order_items_delete ON order_items FOR DELETE
  USING (app.is_admin());

--> statement-breakpoint

-- ========================================
-- products: seller_id column; anyone can see active products
-- ========================================
CREATE POLICY products_select ON products FOR SELECT
  USING (is_active = true OR app.is_owner_or_admin(seller_id));
--> statement-breakpoint
CREATE POLICY products_insert ON products FOR INSERT
  WITH CHECK (app.is_owner_or_admin(seller_id));
--> statement-breakpoint
CREATE POLICY products_update ON products FOR UPDATE
  USING (app.is_owner_or_admin(seller_id));
--> statement-breakpoint
CREATE POLICY products_delete ON products FOR DELETE
  USING (app.is_owner_or_admin(seller_id));

--> statement-breakpoint

-- ========================================
-- reviews: user_id column; anyone can see approved reviews
-- ========================================
CREATE POLICY reviews_select ON reviews FOR SELECT
  USING (is_approved = true OR app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY reviews_insert ON reviews FOR INSERT
  WITH CHECK (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY reviews_update ON reviews FOR UPDATE
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY reviews_delete ON reviews FOR DELETE
  USING (app.is_owner_or_admin(user_id) OR app.is_admin());

--> statement-breakpoint

-- ========================================
-- seller_profiles: user_id column; anyone can see store info
-- ========================================
CREATE POLICY seller_profiles_select ON seller_profiles FOR SELECT
  USING (true);
--> statement-breakpoint
CREATE POLICY seller_profiles_insert ON seller_profiles FOR INSERT
  WITH CHECK (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY seller_profiles_update ON seller_profiles FOR UPDATE
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY seller_profiles_delete ON seller_profiles FOR DELETE
  USING (app.is_owner_or_admin(user_id));

--> statement-breakpoint

-- ========================================
-- user_roles: user_id column
-- ========================================
CREATE POLICY user_roles_select ON user_roles FOR SELECT
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY user_roles_insert ON user_roles FOR INSERT
  WITH CHECK (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY user_roles_update ON user_roles FOR UPDATE
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY user_roles_delete ON user_roles FOR DELETE
  USING (app.is_owner_or_admin(user_id));

--> statement-breakpoint

-- ========================================
-- verification_tokens: email-based (no user_id FK)
-- ========================================
CREATE POLICY verification_tokens_select ON verification_tokens FOR SELECT
  USING (email = (SELECT email FROM users WHERE id = app.current_user_id()) OR app.is_admin());
--> statement-breakpoint
CREATE POLICY verification_tokens_insert ON verification_tokens FOR INSERT
  WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY verification_tokens_delete ON verification_tokens FOR DELETE
  USING (email = (SELECT email FROM users WHERE id = app.current_user_id()) OR app.is_admin());

--> statement-breakpoint

-- ========================================
-- wishlists: user_id column
-- ========================================
CREATE POLICY wishlists_select ON wishlists FOR SELECT
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY wishlists_insert ON wishlists FOR INSERT
  WITH CHECK (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY wishlists_update ON wishlists FOR UPDATE
  USING (app.is_owner_or_admin(user_id));
--> statement-breakpoint
CREATE POLICY wishlists_delete ON wishlists FOR DELETE
  USING (app.is_owner_or_admin(user_id));

--> statement-breakpoint

-- ========================================
-- withdrawals: seller_id column
-- ========================================
CREATE POLICY withdrawals_select ON withdrawals FOR SELECT
  USING (app.is_owner_or_admin(seller_id));
--> statement-breakpoint
CREATE POLICY withdrawals_insert ON withdrawals FOR INSERT
  WITH CHECK (app.is_owner_or_admin(seller_id));
--> statement-breakpoint
CREATE POLICY withdrawals_update ON withdrawals FOR UPDATE
  USING (app.is_owner_or_admin(seller_id));
--> statement-breakpoint
CREATE POLICY withdrawals_delete ON withdrawals FOR DELETE
  USING (app.is_admin());

--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- 4. By default deny all (safety net — ensures no rows leak)
-- ---------------------------------------------------------------------------

ALTER TABLE addresses        FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE audit_logs       FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE blogs            FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE cart             FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE cart_items       FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE notifications    FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE orders           FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE order_items      FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE products         FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE reviews          FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE seller_profiles  FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE user_roles       FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE verification_tokens FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE wishlists        FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE withdrawals      FORCE ROW LEVEL SECURITY;
