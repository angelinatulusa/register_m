using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace register_m.Migrations
{
    /// <inheritdoc />
    public partial class AddedKasutajas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Kasutaja",
                table: "Kasutaja");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Aeg",
                table: "Kasutaja",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Kasutaja",
                table: "Kasutaja",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Kasutaja",
                table: "Kasutaja");

            migrationBuilder.RenameTable(
                name: "Kasutaja",
                newName: "Kasutaja");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "Aeg",
                table: "Kasutaja",
                type: "time",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Kasutaja",
                table: "Kasutaja",
                column: "Id");
        }
    }
}
