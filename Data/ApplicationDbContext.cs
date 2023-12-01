using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using register_m.Models;
using System;

namespace register_m.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Kasutajad> Kasutaja { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
    }
}
