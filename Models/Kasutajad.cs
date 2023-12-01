using Microsoft.AspNetCore.Mvc;

namespace register_m.Models
{
    public class Kasutajad
    {
        public int Id { get; set; }
        public DateTime Aeg { get; set; }
        public string Nimi { get; set; }
        public int Isikukood { get; set; }
        public string Valik { get; set; }
        public string Roll { get; set; }
        public Kasutajad() { }
        public Kasutajad(int id, DateTime aeg, string nimi, int isikukood, string valik, string  roll)
        {
            Id = id;
            Aeg = aeg;
            Nimi = nimi;
            Isikukood = isikukood;
            Valik = valik;
            Roll = roll;
        }
    }
}
