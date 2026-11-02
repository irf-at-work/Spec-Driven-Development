namespace SDD.API.Contracts;

public enum CodeFilterColumn
{
    Code,
    CodeDescription,
    CodeType,
    Value1,
    Value2
}

public sealed record CodeColumnFilter(
    CodeFilterColumn Column,
    CodeFilterOperator Operator,
    string Value);
