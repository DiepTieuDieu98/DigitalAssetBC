using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MusicServer.Migrations
{
    public partial class MusicInit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MusicAssets",
                columns: table => new
                {
                    Name = table.Column<string>(nullable: false),
                    Uri = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MusicAssets", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "MusicInfos",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    Album = table.Column<string>(nullable: true),
                    PublishingYear = table.Column<string>(nullable: true),
                    OwnerId = table.Column<long>(nullable: false),
                    LicenceId = table.Column<long>(nullable: false),
                    CreatureType = table.Column<int>(nullable: false),
                    OwnerType = table.Column<int>(nullable: false),
                    TransactionHash = table.Column<string>(nullable: true),
                    ContractAddress = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: true),
                    TransactionStatus = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MusicInfos", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MusicAssets");

            migrationBuilder.DropTable(
                name: "MusicInfos");
        }
    }
}
