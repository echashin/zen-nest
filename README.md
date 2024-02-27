### Crud Schematics
```shell
nest g -c @hex/nestjs crud-controller test src/rest/crud-controller/controllers/
```
<span style="color:green">+ src/rest/crud/controllers/crud-test.controller.ts</span>

```shell
nest g -c @hex/nestjs crud-entity test src/test
```

<ul>
  <li style="color:green">+ src/test/entity/test.entity.ts</li>
  <li style="color:green">
    + src/test/inputs/
    <ul style="color:green">
      <li>test-create.input.ts</li>
      <li>test-update.input.ts</li>
    </ul>
  </li>
</ul>