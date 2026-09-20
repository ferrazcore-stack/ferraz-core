# FERRAZ — Build Status

## Decision
The FERRAZ CORE build is greenfield. Existing Lovable material is reference only; no legacy UI or data is required for migration.

## Current phase
Foundation → application shell → functional modules.

## Non-negotiables
- Multi-tenant architecture.
- One official source of truth for operational data.
- Low visual clutter and icon-assisted navigation.
- Configurable light/dark appearance and font size.
- Commercial and technical responsibilities remain distinct.
- Closed orders are protected from silent overwrites.
- Customer-facing proposals use the company's identity, not FERRAZ branding.
- Fê is humanized, contextual, permission-bounded and never a second source of truth.

## Immediate build sequence
1. Application shell and navigation.
2. FERRAZ Central administration.
3. Tenant/company context.
4. Authentication and authorization.
5. Customer and project foundations.
6. Budget/proposal experience.
7. Order lifecycle.
8. Technical and production workflows.

## Working rule
Do not redesign the architecture while implementing a module unless a concrete contradiction is found. Record such contradictions as an ADR before changing a foundational rule.
