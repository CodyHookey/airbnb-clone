json.charge do
  json.currency @charge.currency
  json.amount @charge.amount
  json.completed @charge.complete
end