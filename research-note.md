# Research Note: DummyJSON API Integration & Storage Optimization

### Overview

This note covers tactical findings gathered during preparation for building the CRM data layer. It highlights technical considerations for handling remote resources and browser restrictions.

### 1. Data Structure Alignment

The Mock API (`https://dummyjson.com/users`) exposes a default payload schemas using camelCase conventions (e.g., `firstName`, `lastName`, `company.name`). To construct a clean enterprise layout, the mapping layers restructure incoming payloads on initial synchronization:

```javascript
name: `${user.firstName} ${user.lastName}`;
company: user.company.name;
```
