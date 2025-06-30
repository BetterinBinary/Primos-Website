# Debug Command

Automated debugging workflow for the Primos Pizza website with documentation research and systematic fixes.

## Usage

```bash
claude debug "Your error message or issue description here"
```

## What this command does

I will systematically debug your Primos Pizza app issue by:

1. **Analyzing the Error**: Parse and understand the root cause of the issue
2. **Researching Documentation**: Auto-fetch relevant docs from official sources
3. **Creating Fix Specification**: Generate detailed step-by-step repair plan  
4. **Executing the Fix**: Implement the solution following best practices
5. **Testing & Validation**: Verify the fix works without breaking existing functionality

## Research Sources

I'll automatically research these documentation sources based on the error type:

- **Svelte 5 Docs**: https://svelte.dev/docs/svelte/llms.txt (for runes, components, reactivity)
- **SvelteKit Docs**: https://svelte.dev/docs/kit/llms.txt (for routing, loading, forms, deployment)
- **Error-specific URLs**: https://svelte.dev/e/[error_code] for specific error messages

## Debugging Process

### 1. Error Analysis
- Identify error type (Svelte runes, TypeScript, build, runtime, etc.)
- Parse error messages and stack traces
- Understand project context and affected components

### 2. Documentation Research  
- Fetch relevant official documentation automatically
- Search for known patterns and solutions
- Cross-reference with project architecture in CLAUDE.md

### 3. Fix Specification
- Create detailed step-by-step repair plan
- Identify files that need modification
- Plan testing strategy to verify fix

### 4. Implementation
- Apply fixes systematically with proper error handling
- Follow project coding standards and conventions
- Maintain consistency with existing codebase patterns

### 5. Testing & Validation
- Test in development mode (`npm run dev`)
- Verify production build (`npm run build`)
- Check for new errors or regressions
- Validate core functionality still works

## Project Context

This command understands the Primos Pizza project structure:

- **Architecture**: SvelteKit 5 with TypeScript, Tailwind CSS, Vite build system
- **State Management**: Svelte 5 runes pattern with stores in `.svelte.js` files  
- **Components**: UI components, menu components, cart functionality
- **Build System**: Vite with enhanced-img, manual code splitting
- **Testing**: Vitest with JSDOM and @testing-library/svelte

## Example Usage

```bash
# Debug Svelte errors
claude debug "Svelte error: rune_outside_svelte - The $state rune is only available inside .svelte files"

# Debug build issues  
claude debug "Build failing with TypeScript errors in MenuItem component"

# Debug runtime errors
claude debug "Menu page not loading, console shows effect_orphan error"

# Debug styling issues
claude debug "Tailwind classes not applying to Button component"
```

## Expected Behavior

When you run this command, I will:

1. ✅ **Research** the error in official documentation
2. ✅ **Analyze** the project context and affected files  
3. ✅ **Create** a detailed fix specification
4. ✅ **Implement** the solution systematically
5. ✅ **Test** both development and production builds
6. ✅ **Verify** no regressions were introduced

The command follows the same systematic approach that successfully resolved previous issues like the `$effect` orphan error and favicon manifest problems.

## Error Types Handled

- **Svelte 5 Runes**: `$state`, `$derived`, `$effect` usage issues
- **TypeScript**: Type errors, interface mismatches, import issues
- **Build System**: Vite compilation errors, plugin conflicts
- **Runtime**: Component loading, state management, navigation issues
- **Styling**: Tailwind CSS, component styling, responsive design
- **Testing**: Vitest configuration, component testing, mocking

## Success Criteria

A successful debug session will result in:
- ✅ Error completely resolved
- ✅ Clean build output (`npm run build`)  
- ✅ Working development server (`npm run dev`)
- ✅ No new console errors introduced
- ✅ Core app functionality preserved