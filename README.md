<img src="https://raw.githubusercontent.com/diit/overtime-cli/master/example.png" align="right">

<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/diit/overtime-cli/master/logo.png" alt="OverTime" width="400">
  <br>
  OverTime
  <br>
</h1>

<h4 align="center">Easy time-overlap tables for remote teams.</h4>

### Install
`npm install -g overtime-cli`

### Use
```
overtime America/Toronto Asia/Bangkok ...
```
Available IANA zones can be found on Wikipedia : [List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

Otherwise you can use `utc` shortcut.
Ex:
```
overtime America/Toronto Asia/Bangkok
```
can also be
```
overtime utc-5 utc+7
```

Made with ☕ in 🇨🇦
