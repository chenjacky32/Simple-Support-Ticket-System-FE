```markdown
# Simple-Support-Ticket-System-FE Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `Simple-Support-Ticket-System-FE` repository. The project is a TypeScript-based frontend built with Next.js, following clear coding standards and commit practices. You'll learn how to structure files, write imports/exports, and contribute using the project's preferred commit style.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `supportTicketForm.tsx`, `userProfile.ts`

### Import Style
- Use **alias imports** for modules.
  - Example:
    ```typescript
    import TicketList from '@/components/ticketList'
    ```

### Export Style
- Mixed usage of **default** and **named exports**.
  - Default export example:
    ```typescript
    export default function TicketList() { ... }
    ```
  - Named export example:
    ```typescript
    export const TicketStatus = { OPEN: 'open', CLOSED: 'closed' }
    ```

### Commit Messages
- Use **conventional commits** with the `feat` prefix.
  - Example: `feat: add ticket filtering by status`
- Keep commit messages concise (average ~33 characters).

## Workflows

### Feature Development
**Trigger:** When adding a new feature or component  
**Command:** `/feature`

1. Create a new branch for your feature.
2. Implement the feature following coding conventions.
3. Write or update relevant tests (`*.test.*` files).
4. Commit changes using the `feat` prefix.
   - Example: `feat: implement ticket search bar`
5. Open a pull request for review.

### Code Importing
**Trigger:** When importing modules or components  
**Command:** `/import`

1. Use alias imports starting with `@/`.
   - Example: `import UserCard from '@/components/userCard'`
2. Ensure imported file names use camelCase.

### Testing
**Trigger:** When writing or updating tests  
**Command:** `/test`

1. Create or update test files matching the `*.test.*` pattern.
2. Place tests alongside the component or in a `__tests__` directory.
3. Use the project's preferred (unknown) testing framework.
4. Run tests before committing.

## Testing Patterns

- Test files follow the `*.test.*` naming convention.
  - Example: `ticketList.test.tsx`
- The specific testing framework is not detected; review existing test files for patterns.
- Place tests near the components they cover or in dedicated test directories.

## Commands
| Command    | Purpose                                   |
|------------|-------------------------------------------|
| /feature   | Start a new feature development workflow  |
| /import    | Follow import conventions for modules     |
| /test      | Write or update tests for components      |
```